import { readFileSync } from 'fs';
import { resolve } from 'path';

export const PRIVATE_KEY = readFileSync(resolve(__dirname, 'mock-data', 'keys', 'private.pem')).toString();
export const PUBLIC_KEY = readFileSync(resolve(__dirname, 'mock-data', 'keys', 'public.pem')).toString();