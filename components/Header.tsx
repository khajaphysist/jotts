import Link from 'next/link';
import React from 'react';

import { AppBar, Button, createStyles, Toolbar, WithStyles, withStyles } from '@material-ui/core';

const styles = () => createStyles({
  loginButton: {
    float: "right"
  }
})

interface StyleProps extends WithStyles<typeof styles> { }

class Header extends React.Component<StyleProps> {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar >
            <Link href="/">
              <Button>Home</Button>
            </Link>
            <Link href="/about">
              <Button>About</Button>
            </Link>
            <Link href="/login">
              <Button className={this.props.classes.loginButton}>Login</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(Header)