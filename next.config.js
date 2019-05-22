const withTypescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')

const APP_ENV_VARS = process.env.APP_ENV_VARS;
const vars = JSON.parse(APP_ENV_VARS||"{}");
const { S3_IMAGE_PREFIX, GRAPHQL_ENDPOINT, GRAPHQL_PROXY_PATH } = vars

module.exports = withTypescript(withCSS({
    publicRuntimeConfig: {
        graphqlEndPoint: process.env.NODE_ENV === 'production' ? GRAPHQL_PROXY_PATH : GRAPHQL_ENDPOINT,
        s3ImagePrefix: S3_IMAGE_PREFIX
    },
    serverRuntimeConfig: {
        graphqlEndPoint: GRAPHQL_ENDPOINT
    }
}))