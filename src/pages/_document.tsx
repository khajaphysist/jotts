import Document, { Head, Main, NextDocumentContext, NextScript } from 'next/document';
import PropTypes from 'prop-types';
import React from 'react';
import flush from 'styled-jsx/server';

import { PageContext } from '../page-config/getPageContext';

class MyDocument extends Document<{ pageContext: PageContext }> {
    static async getInitialProps(ctx: NextDocumentContext) {
        // Resolution order
        //
        // On the server:
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. document.getInitialProps
        // 4. app.render
        // 5. page.render
        // 6. document.render
        //
        // On the server with error:
        // 1. document.getInitialProps
        // 2. app.render
        // 3. page.render
        // 4. document.render
        //
        // On the client
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. app.render
        // 4. page.render

        // Render app and page and get the context of the page with collected side effects.
        let pageContext: PageContext | undefined;
        const page = ctx.renderPage(Component => {
            const WrappedComponent = (props: any) => {
                pageContext = props.pageContext;
                return <Component {...props} />;
            };

            WrappedComponent.propTypes = {
                pageContext: PropTypes.object.isRequired,
            };

            return WrappedComponent;
        });

        let css = '';
        // It might be undefined, e.g. after an error.
        if (pageContext) {
            css = pageContext.sheetsRegistry.toString();
        }

        return {
            ...page,
            pageContext,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: (
                <React.Fragment>
                    <style
                        id="jss-server-side"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: css }}
                    />
                    {flush() || null}
                </React.Fragment>
            ),
        };
    };
    render() {
        const { pageContext } = this.props;

        return (
            <html lang="en" dir="ltr">
                <Head>
                    {/* Google webmaster verification tag */}
                    <meta name="google-site-verification" content="4B5AlQIQchKte-kQjJ2rk50UAViZ_XDI8l-59zN82TM" />
                    <meta charSet="utf-8" />
                    {/* Use minimum-scale=1 to enable GPU rasterization */}
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    {/* PWA primary color */}
                    <meta
                        name="theme-color"
                        content={pageContext ? pageContext.theme.palette.primary.main : undefined}
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                    />

                    <link rel="shortcut icon"
                        href="/static/favicon.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

export default MyDocument;
