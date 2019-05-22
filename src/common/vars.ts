import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

export const s3ImagePrefix = process.env.s3ImagePrefix;
export const graphqlEndpoint: string = process.browser ? publicRuntimeConfig.graphqlEndPoint : serverRuntimeConfig.graphqlEndPoint;