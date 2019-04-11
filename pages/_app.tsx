import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from 'react-apollo';
import JssProvider from 'react-jss/lib/JssProvider';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import getPageContext, { PageContext } from '../src/getPageContext';
import withApolloClient from '../src/withApolloClient';

class MyApp extends App<{ apolloClient: ApolloClient<NormalizedCacheObject> }> {
    private pageContext: PageContext;
    constructor(props: any) {
        super(props);
        this.pageContext = getPageContext();
    }

    componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    public render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head>
                    <title>Test page</title>
                </Head>
                <ApolloProvider client={this.props.apolloClient}>
                    <JssProvider
                        registry={this.pageContext.sheetsRegistry}
                        generateClassName={this.pageContext.generateClassName}>
                        <MuiThemeProvider
                            theme={this.pageContext.theme}
                            sheetsManager={this.pageContext.sheetsManager}>
                            <CssBaseline />
                            <Component pageContext={this.pageContext} {...pageProps} />
                        </MuiThemeProvider>
                    </JssProvider>
                </ApolloProvider>
            </Container>
        )
    }
}

export default withApolloClient(MyApp);