import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as next from 'next';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import * as localStrategy from 'passport-local';
import * as uuidv4 from 'uuid/v4';

import User from './agent';
import { PRIVATE_KEY, PUBLIC_KEY } from './vars';
import { CookieUser } from '../common/types';

const dev = process.env.NODE_ENV !== 'production';
console.log(`Running in ${process.env.NODE_ENV} mode`)
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();
const LocalStrategy = localStrategy.Strategy;

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
                            const { password_hash, password_iterations, password_salt, email, ...rest } = user
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
                const user:CookieUser = req.user
                req.user.jotts_claims = {
                    'x-hasura-default-role': 'user',
                    'x-hasura-allowed-roles': ['user'],
                    'x-hasura-user-id': req.user.id
                }
                const token = jwt.sign(req.user, PRIVATE_KEY, { algorithm: "RS256" });
                res.send({user,token})
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

        server.get('/post/:slug'
            , (req, res) => {
                const page = '/post';
                const queryParams = { slug: req.params.slug };
                app.render(req, res, page, queryParams);
            })

        server.get('/:handle/dashboard'
            , (req, res) => {
                const page = '/dashboard';
                const queryParams = { handle: req.params.handle };
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