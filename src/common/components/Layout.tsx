import React from 'react';

import { createStyles, Paper, WithStyles, withStyles } from '@material-ui/core';

import Header from './Header';

const styles = () => createStyles({
    content: {
        margin: 20,
        padding: 20,
    },
    main: {
        height: "auto"
    }
})

interface StyleProps extends WithStyles<typeof styles> { }

class Layout extends React.Component<StyleProps>{
    public render() {
        return (
            <div className={this.props.classes.main}>
                <Header />
                <div className={this.props.classes.content}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Layout);