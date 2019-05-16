import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { getUserToken } from '../common/utils/loginStateProvider';

let apolloClient: ReturnType<typeof create> | null = null;

if (!process.browser) {
    global.fetch = fetch;
}

const create = (initialState: any) => {
    const token = process.browser ? getUserToken() : undefined;
    const headers = token && typeof token === 'string' && token.length > 0 ? { authorization: `Bearer ${token}` } : {}
    return new ApolloClient({
        connectToDevTools: process.browser,
        ssrMode: !process.browser,
        link: new HttpLink({
            uri: 'http://localhost:8080/v1/graphql',
            headers,
            credentials: 'include'
        }),
        cache: new InMemoryCache().restore(initialState || {})
    })
};

export default function initApollo(initialState: any) {
    if (!process.browser) {
        return create(initialState)
    }

    if (!apolloClient) {
        apolloClient = create(initialState);
    }
    return apolloClient;
}