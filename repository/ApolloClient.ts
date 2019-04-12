import ApolloClient from "apollo-boost";
import fetch from 'isomorphic-unfetch';

export default new ApolloClient({
    uri: 'http://localhost:8080/v1alpha1/graphql',
    fetch
})