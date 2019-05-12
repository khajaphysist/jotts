import '../static/prism.css';

import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from 'react-apollo';
import JssProvider from 'react-jss/lib/JssProvider';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import redirectTo from '../common/components/redirectTo';
import getPageContext, { PageContext } from '../page-config/getPageContext';
import withApolloClient from '../page-config/withApolloClient';
import { isLoggedIn } from '../common/utils/loginStateProvider';

class MyApp extends App<{ apolloClient: ApolloClient<NormalizedCacheObject> }> {
    private pageContext: PageContext;
    constructor(props: any) {
        super(props);
        this.pageContext = getPageContext();
    }

    static async getInitialProps({ Component, ctx }: NextAppContext) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

        if (["/login", "/"].includes(ctx.pathname)) {
            return { pageProps };
        } else if (process.browser && !isLoggedIn()) {
            redirectTo('/login', { res: ctx.res, status: 301 })
        }
        return { pageProps }
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