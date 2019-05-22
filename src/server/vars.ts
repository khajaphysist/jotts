import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';

dotenvExpand(dotenv.config({ path: resolve(__dirname, '..', '..', 'vars.env') }))

export const {
    PRIVATE_KEY,
    PUBLIC_KEY,
    S3_ENDPOINT,
    S3_BUCKENT_NAME,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    HASURA_ADMIN_SECRET,
    GRAPHQL_ENDPOINT,
    PG_CONNECTION_STRING,
    ADMIN_EMAIL,
    ADMIN_EMAIL_PASS,
} = process.env as { [key: string]: string }