import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import cookies from 'next-cookies';
import App, { Container, NextAppContext } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from 'react-apollo';
import JssProvider from 'react-jss/lib/JssProvider';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import redirectTo from '../common/components/redirectTo';
import { LOGIN_TOKEN_COOKIE_NAME, USER_INFO_COOKIE_NAME } from '../common/vars';
import getPageContext, { PageContext } from '../page-config/getPageContext';
import withApolloClient from '../page-config/withApolloClient';

class MyApp extends App<{ apolloClient: ApolloClient<NormalizedCacheObject> }> {
    private pageContext: PageContext;
    constructor(props: any) {
        super(props);
        this.pageContext = getPageContext();
    }

    static async getInitialProps({ Component, ctx }: NextAppContext) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        const c = cookies(ctx);

        if (["/login", "/"].includes(ctx.pathname)) {
            return { pageProps };
        } else if (typeof c[USER_INFO_COOKIE_NAME] !== 'undefined') {
            const headers = { "Cookie": typeof c[LOGIN_TOKEN_COOKIE_NAME] !== 'undefined' ? `${LOGIN_TOKEN_COOKIE_NAME}=${c[LOGIN_TOKEN_COOKIE_NAME]}` : "" };
            const response = await fetch("http://localhost:3000/check-auth", { method: "POST", credentials: "include", headers }).then(data => data.text());
            console.log("Response: ", response)
            if (response === "OK") return { pageProps };
            else redirectTo('/login', { res: ctx.res, status: 301 });
        } else {
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