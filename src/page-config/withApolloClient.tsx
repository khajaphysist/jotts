import Head from 'next/head';
import React from 'react';
import { getDataFromTree } from 'react-apollo';

import initApollo from './initApollo';

export default (App: any) => {
    return class Apollo extends React.Component {
        private apolloClient: ReturnType<typeof initApollo>;
        static displayName = 'withApollo(App)'
        static async getInitialProps(ctx: any) {
            const { Component, router } = ctx

            let appProps = {}
            if (App.getInitialProps) {
                appProps = await App.getInitialProps(ctx)
            }

            // Run all GraphQL queries in the component tree
            // and extract the resulting data
            const apollo = initApollo(undefined)
            if (!process.browser) {
                try {
                    // Run all GraphQL queries
                    await getDataFromTree(
                        <App
                            {...appProps}
                            Component={Component}
                            router={router}
                            apolloClient={apollo}
                        />
                    )
                } catch (error) {
                    // Prevent Apollo Client GraphQL errors from crashing SSR.
                    // Handle them in components via the data.error prop:
                    // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
                    console.error('Error while running `getDataFromTree`', JSON.stringify(error))
                }

                // getDataFromTree does not call componentWillUnmount
                // head side effect therefore need to be cleared manually
                Head.rewind()
            }

            // Extract query data from the Apollo store
            const apolloState = apollo.cache.extract()

            return {
                ...appProps,
                apolloState
            }
        }

        constructor(props: any) {
            super(props)
            this.apolloClient = initApollo(props.apolloState)
        }

        render() {
            return <App {...this.props} apolloClient={this.apolloClient} />
        }
    }
}
