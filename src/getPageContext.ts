import { SheetsRegistry } from 'jss';

import { green, purple } from '@material-ui/core/colors';
import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: purple[300],
            main: purple[500],
            dark: purple[700],
        },
        secondary: {
            light: green[300],
            main: green[500],
            dark: green[700],
        },
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