import gql from 'graphql-tag';

import { GetUser, GetUserVariables } from '../types/GetUser';
import { RegisterUser, RegisterUserVariables } from '../types/RegisterUser';
import ApolloClient from './ApolloClient';

const client = ApolloClient;

class User {
    public async registerUser(data: RegisterUserVariables): Promise<RegisterUser> {
        return client.mutate({
            mutation: gql`
            mutation RegisterUser($handle: String!, $email: String!, $password_hash: String!, $password_salt: String!, $password_iterations: Int) {
                insert_jotts_user(
                    objects: {
                    handle: $handle,
                    email: $email,
                    password_hash: $password_hash,
                    password_salt: $password_salt,
                    password_iterations: $password_iterations
                    }) {
                    returning {
                        id
                    }
                }
            }
            `,
            variables: data
        });
    }

    public async getOne(data: GetUserVariables){
        console.log(data);
        const res = (await client.query<GetUser, GetUserVariables>({
            query: gql`
            query GetUser($email: String!) {
                jotts_user(where:{email:{_eq:$email}}) {
                    id
                    name
                    password_hash
                    password_salt
                    password_iterations
                    email
                    profile_picture
                    handle
                }
            }
            `,
            variables: data
        }));
        console.log(JSON.stringify(res));
        return res.data.jotts_user[0];

    }
}

export default new User()