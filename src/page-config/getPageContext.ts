import { SheetsRegistry } from 'jss';

import { blue, pink } from '@material-ui/core/colors';
import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink,
    },
    typography: {
        useNextVariants: true,
    },
})

const createPageContext = () => ({
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName()
})

export type PageContext = ReturnType<typeof createPageContext>;

let pageContext: undefined | PageContext;

export default function getPageContext() {
    if (!process.browser) {
        return createPageContext();
    }
    if (!pageContext) {
        pageContext = createPageContext();
    }
    return pageContext;
}