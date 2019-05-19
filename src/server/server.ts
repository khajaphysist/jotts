import { S3 } from 'aws-sdk';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { extension } from 'mime-types';
import * as multer from 'multer';
import * as next from 'next';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import * as localStrategy from 'passport-local';
import * as uuidv4 from 'uuid/v4';

import { CookieUser } from '../common/types';
import User from './agent';
import { PRIVATE_KEY, PUBLIC_KEY } from './vars';
import { sendResetPasswordMail } from './reset-password';

const dev = process.env.NODE_ENV !== 'production';
console.log(`Running in ${process.env.NODE_ENV} mode`)
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();
const LocalStrategy = localStrategy.Strategy;
const upload = multer({
    limits: { files: 1, fileSize: 1024 * 512 }, fileFilter: (_req, file, cb) => {
        return file.mimetype.startsWith('image/') ? cb(null, true) : cb(Error("Only Image files are allowed"), false)
    }
});

const validatePassword = (password: string) => {
    return password && password.length > 6 ? true : false
}
const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || !re.test(String(email).toLowerCase())) {
        return false
    }
    return true
}

const s3 = new S3({
    endpoint: 'http://127.0.0.1:9001/images',
    s3BucketEndpoint: true,
    accessKeyId: 'minio',
    secretAccessKey: 'minio123',
    signatureVersion: 'v4'
})

app
    .prepare()
    .then(() => {
        const server = express();
        server.use(bodyParser.json());
        server.use(passport.initialize());
        server.use(cookieParser())

        passport.use(new LocalStrategy(
            function (email, password, done) {
                User.getOne(email)
                    .then(
                        function (user) {
                            if (!user) {
                                return done(null, false);
                            }
                            const { password_hash, password_iterations, password_salt, ...rest } = user
                            crypto.pbkdf2(password, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                                const hash = key.toString('hex');
                                if (err || hash !== password_hash) {
                                    return done(null, false);
                                }
                                return done(null, rest);
                            })
                        }
                    )
                    .catch(
                        e => {
                            console.log(e);
                            return done(null, false);
                        }
                    );
            }
        ));

        passport.use(new JwtStrategy({
            algorithms: ["RS256"], secretOrKey: PUBLIC_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, (payload, done) => {
            return done(null, payload)
        }))

        server.post('/login',
            passport.authenticate('local', { session: false }),
            (req, res) => {
                const user: CookieUser = req.user
                req.user.jotts_claims = {
                    'x-hasura-default-role': 'user',
                    'x-hasura-allowed-roles': ['user'],
                    'x-hasura-user-id': req.user.id
                }
                const token = jwt.sign(req.user, PRIVATE_KEY, { algorithm: "RS256", expiresIn: "2d" });
                user.exp = Math.floor(Date.now() / 1000) + 86400 * 2 - 10;
                res.send({ user, token })
            });

        server.post('/check-auth',
            passport.authenticate('jwt', { session: false }),
            (_req, res) => {
                console.log("check auth called...")
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain")
                res.send("OK")
            })

        server.post('/register', (req, res) => {
            const { email, handle, password } = req.body;
            if (!(validateEmail(email) && validatePassword(password) && handle)) {
                return res.status(400).send("Invalid email, or password length less than 6 characters or empty handle")
            }
            const password_salt = uuidv4();
            const password_iterations = 1000 + Math.floor(Math.random() * 1000);
            crypto.pbkdf2(password, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                if (err) {
                    res.status(500).send(err)
                    return
                };
                const user = { email, password_hash: key.toString('hex'), password_iterations, password_salt, handle };
                User.registerUser(user)
                    .then(d => { res.status(200).send(d) }, e => res.status(500).send(e));
            })
        })

        server.post('/change-password',
            passport.authenticate('jwt', { session: false }),
            (req, res) => {
                const user: CookieUser = req.user;
                const { oldPassword, newPassword } = req.body;
                if (validatePassword(newPassword)) {
                    res.status(400).send("Password should have 6 characters minimum")
                }
                User.getOne(user.email)
                    .then(userDetails => {
                        if (userDetails) {
                            const { password_hash, password_iterations, password_salt } = userDetails
                            crypto.pbkdf2(oldPassword, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                                const hash = key.toString('hex');
                                if (err || hash !== password_hash) {
                                    return res.status(401).send("Invalid Password");
                                }
                                const password_salt = uuidv4();
                                const password_iterations = 1000 + Math.floor(Math.random() * 1000);
                                crypto.pbkdf2(newPassword, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                                    if (err) {
                                        return res.status(500).send("unknown error occurred")
                                    }
                                    const newHash = key.toString('hex');
                                    User.changePassword(userDetails.id, newHash, password_salt, password_iterations)
                                        .then((r: any) => {
                                            console.log(r);
                                            res.status(200).send("success")
                                        })
                                        .catch((e: any) => {
                                            console.log(e)
                                            res.status(500).send("unknown error occurred")
                                        })
                                })
                            })
                        }
                    }).catch(e => {
                        console.log(e)
                        res.status(500).send("unknown error occurred")
                    })
            }
        )

        server.post('/image',
            passport.authenticate('jwt', { session: false }),
            upload.single('image'),
            (req, res) => {
                const { name } = req.body
                const { mimetype, buffer } = req.file;
                const ext = extension(mimetype)
                if (!ext) {
                    return res.status(500).send("Picture extension not supported")
                }
                const imageName = uuidv4() + '.' + ext
                s3.putObject({
                    Body: buffer,
                    Key: imageName,
                    Bucket: 'images',
                    Tagging: `name=${name}`
                }, (err) => {
                    if (err) {
                        console.log("Error: ", err);
                        res.status(500).send(err)
                    } else {
                        res.status(200).send(imageName)
                    }

                })
            })
        server.delete('/image',
            passport.authenticate('jwt', { session: false }),
            (req, res) => {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).send("Invalid Image id")
                }
                s3.deleteObject({
                    Bucket: 'images',
                    Key: id,
                }, (err) => {
                    if (err) {
                        console.log("Error: ", err);
                        res.status(500).send(err)
                    } else {
                        res.status(200).send("OK")
                    }
                })
            }
        )

        server.post('/forgot-password',
            (req, res) => {
                const { email } = req.body;
                if (!validateEmail(email)) {
                    return res.status(400).send("Invalid Email")
                }
                User.getOne(email).then(userDetails => {
                    if (userDetails) {
                        const token = jwt.sign({ id: userDetails.id }, PRIVATE_KEY, { algorithm: "RS256", expiresIn: "1h" });
                        sendResetPasswordMail(email, token).then(r => {
                            if (r) {
                                res.status(200).send("OK")
                            } else {
                                res.status(500).send("Some error occurred")
                            }
                        }).catch(e => {
                            console.log(e)
                            res.status(500).send("Some error occurred")
                        })
                    }
                })
            })
        server.post('/reset-password',
            (req, res) => {
                const { newPassword, token } = req.body;
                if (!newPassword || !token || !validatePassword(newPassword)) {
                    return res.status(400).send("Invalid request")
                }
                try {
                    const { id } = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }) as { id: string };
                    const password_salt = uuidv4();
                    const password_iterations = 1000 + Math.floor(Math.random() * 1000);
                    crypto.pbkdf2(newPassword, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                        if (err) {
                            return res.status(500).send("unknown error occurred")
                        }
                        const newHash = key.toString('hex');
                        User.changePassword(id, newHash, password_salt, password_iterations)
                            .then((r: any) => {
                                console.log(r);
                                res.status(200).send("success")
                            })
                            .catch((e: any) => {
                                console.log(e)
                                res.status(500).send("unknown error occurred")
                            })
                    })
                } catch (error) {
                    console.log(error)
                    res.status(403).send("Unauthorized")
                }
            })


        server.get('/post/:slug'
            , (req, res) => {
                const page = '/post';
                const queryParams = { slug: req.params.slug };
                app.render(req, res, page, queryParams);
            })

        server.get('/:handle/dashboard'
            , (req, res) => {
                const page = '/dashboard';
                const { post_id, folder_id } = req.query
                const queryParams = { handle: req.params.handle, post_id, folder_id };
                app.render(req, res, page, queryParams);
            })

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, (err: any) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000')
        });
    }
    )
    .catch(
        e => {
            console.error(e.stack)
            process.exit(1);
        }
    )