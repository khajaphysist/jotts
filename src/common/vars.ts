import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

export const s3ImagePrefix = publicRuntimeConfig.s3ImagePrefix;
export const graphqlEndpoint: string = process.browser ? publicRuntimeConfig.graphqlEndPoint : serverRuntimeConfig.graphqlEndPoint;