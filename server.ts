import * as crypto from 'crypto';
import * as express from 'express';
import * as next from 'next';
import * as uuidv4 from 'uuid/v4';

import User from './repository/User';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {
        const server = express();

        server.post('/register', (req, res) => {
            const { email, username, password } = req.body;
            const password_salt = uuidv4();
            const password_iterations = 1000 + Math.floor(Math.random() * 1000);
            crypto.pbkdf2(password, password_salt, password_iterations, 64, 'sha512', (err, key) => {
                if (err) {
                    res.status(500).send(err)
                };
                User.registerUser({ email, password_hash: key.toString('hex'), password_iterations, password_salt, username })
                    .then(d => res.status(200).send(d), e => res.status(500).send(e));
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