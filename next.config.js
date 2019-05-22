const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config())

const withTypescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')

const isProduction = process.env.NODE_ENV === 'production';
const { S3_IMAGE_PREFIX, GRAPHQL_ENDPOINT, GRAPHQL_PROXY_PATH } = process.env

module.exports = withTypescript(withCSS({
    publicRuntimeConfig: {
        graphqlEndPoint: isProduction ? GRAPHQL_PROXY_PATH : GRAPHQL_ENDPOINT,
        s3ImagePrefix: S3_IMAGE_PREFIX
    },
    serverRuntimeConfig: {
        graphqlEndPoint: GRAPHQL_ENDPOINT
    }
}))