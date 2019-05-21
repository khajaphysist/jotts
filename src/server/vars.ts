import { readFileSync } from 'fs';
import { resolve } from 'path';

const envConfig = JSON.parse(readFileSync(resolve(__dirname, '..', '..', 'env-config.json')).toString())

export const {
    PRIVATE_KEY,
    PUBLIC_KEY,
    S3_IMAGES_BUCKET_URL,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    HASURA_ADMIN_SECRET,
    GRAPHQL_ENDPOINT,
    PG_CONNECTION_STRING,
    ADMIN_EMAIL,
    ADMIN_EMAIL_PASS,
} = envConfig