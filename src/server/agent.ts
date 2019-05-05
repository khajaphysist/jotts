import * as Knex from 'knex';

const knex = Knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    }
});

interface RegisterUserVariables {
    handle: string
    email: string
    password_hash: string
    password_salt: string
    password_iterations: number
}

interface UserLoginDetails {
    id: string
    email: string
    password_hash: string
    password_salt: string
    password_iterations: number
}

class User {
    public async registerUser({ handle, ...login_details }: RegisterUserVariables): Promise<string> {

        let newId = ''
        await knex.transaction((trx) => {
            return trx
                .insert({ handle }, ['id']).into('jotts.user')
                .then((ids) => {
                    if (!ids || ids.length < 1 || !ids[0].id) {
                        return trx.rollback();
                    }
                    const id = ids[0].id;
                    return trx.insert({ ...login_details, id })
                        .into('jotts.login_details')
                        .then(() => {
                            newId = id;
                        })
                })
        })
        return newId;
    }

    public async getOne(email: string): Promise<UserLoginDetails> {
        const res = await knex('jotts.login_details').where('email', email).select();
        return res[0];
    }
}

export default new User()