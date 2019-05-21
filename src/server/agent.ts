import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import fetch from 'isomorphic-unfetch';
import * as Knex from 'knex';

import { GetUser, GetUserVariables } from '../common/apollo-types/GetUser';
import { GRAPHQL_ENDPOINT, HASURA_ADMIN_SECRET, PG_CONNECTION_STRING } from './vars';

const knex = Knex({
    client: 'pg',
    connection: PG_CONNECTION_STRING,
});

const client = new ApolloClient({
    uri: GRAPHQL_ENDPOINT,
    fetch: fetch
});

interface RegisterUserVariables {
    handle: string
    email: string
    password_hash: string
    password_salt: string
    password_iterations: number
}

interface UserDetails {
    id: string
    email: string
    password_hash: string
    password_salt: string
    password_iterations: number
    name: string,
    handle: string,
    country: string,
    profile_picture: string,
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

    public async changePassword(userId: string, newPasswordHash: string, password_salt: string, password_iterations: number) {
        return knex('jotts.login_details')
            .where({ id: userId })
            .update({ password_hash: newPasswordHash, password_salt, password_iterations })
    }

    public async getOne(email: string): Promise<UserDetails | undefined> {
        const user = (await knex('jotts.login_details').where('email', email).select())[0];
        if (user) {
            const res = await client.query<GetUser, GetUserVariables>({
                query: gql`
                query GetUser($id: uuid!){
                    jotts_user_by_pk(id: $id) {
                        name,
                        handle,
                        country,
                        profile_picture
                    }
                }
                `,
                variables: { id: user.id },
                context: {
                    headers: {
                        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
                    }
                }
            });
            if (!res.data.jotts_user_by_pk) {
                return undefined;
            };
            const { __typename, ...rest } = res.data.jotts_user_by_pk;
            return { ...rest, ...user }
        }
        return undefined;
    }
}

export default new User()