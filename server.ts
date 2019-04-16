import * as bodyParser from 'body-parser';
import * as crypto from 'crypto';
import * as express from 'express';
import * as next from 'next';
import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as uuidv4 from 'uuid/v4';

import User from './repository/User';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
const Strategy = LocalStrategy.Strategy

app
    .prepare()
    .then(() => {
        const server = express();
        server.use(bodyParser.json());
        server.use(passport.initialize());

        passport.use(new Strategy(
            function (email, password, done) {
                User.getOne({ email })
                    .then(
                        function ({ __typename, password_hash, password_iterations, password_salt, ...rest }) {
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

        server.post('/login',
            passport.authenticate('local', { session: false, }),
            (req, res) => {
                res.send(req.user)
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
                    .then(d => {res.status(200).send(d) }, e => res.status(500).send(e));
            })
        })

        server.get('/p/:id', (req, res) => {
            const page = '/post';
            const queryParams = { id: req.params.id };
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