import { readFileSync } from 'fs';
import { resolve } from 'path';

if (!(process.env.PRIVATE_KEY && process.env.PUBLIC_KEY)) {
    console.log("Using MOCK keys")
}

export const PRIVATE_KEY = process.env.PRIVATE_KEY || readFileSync(resolve(__dirname, '..', '..', 'mock-data', 'keys', 'private.pem')).toString();
export const PUBLIC_KEY = process.env.PUBLIC_KEY || readFileSync(resolve(__dirname, '..', '..', 'mock-data', 'keys', 'public.pem')).toString();

export const S3_IMAGES_BUCKET_URL = process.env.S3_IMAGES_BUCKET_URL || 'http://127.0.0.1:8888/images'
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY || 'minio';
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || 'minio123'

export const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'khaja'
export const GRAPHQL_ENDPOINT = 'http://localhost:8080/v1/graphql';
export const PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING || ''//'postgresql://postgres:postgres@localhost:5432/postgres'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_EMAIL_PASS = process.env.ADMIN_EMAIL_PASS