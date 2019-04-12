import gql from 'graphql-tag';

import initApollo from '../src/initApollo';
import { RegisterUser, RegisterUserVariables } from '../types/RegisterUser';

const client = initApollo(undefined);

class User {
    public async registerUser(data: RegisterUserVariables): Promise<RegisterUser> {
        return client.mutate({
            mutation: gql`
            mutation RegisterUser($username: String!, $email: String!, $password_hash: String!, $password_salt: String!, $password_iterations: Int) {
                insert_jotts_profile(objects: {
                    username: $username,
                    user:{
                        data:{
                            email: $email,
                            password_hash: $password_hash,
                            password_salt: $password_salt,
                            password_iterations: $password_iterations
                        }
                        }}) {
                    returning {
                        id
                    }
                }
            }
            `,
            variables: data
        });
    }
}

export default new User()