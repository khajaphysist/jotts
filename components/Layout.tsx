import React from 'react';

import { createStyles, Paper, WithStyles, withStyles } from '@material-ui/core';

import Header from './Header';

const styles = () => createStyles({
    main: {
        margin: "80px 20px 20px 20px",
        padding: 20
    }
})

interface StyleProps extends WithStyles<typeof styles> { }

class Layout extends React.Component<StyleProps>{
    public render() {
        return (
            <div>
                <Header />
                <Paper className={this.props.classes.main}>
                    {this.props.children}
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(Layout);