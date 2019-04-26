import Link from 'next/link';
import Router from 'next/router';
import React from 'react';

import {
  AppBar, Button, createStyles, NoSsr, Toolbar, WithStyles, withStyles
} from '@material-ui/core';

import { User } from '../utils/agent';
import { isLoggedIn } from '../utils/loginStateProvider';

const styles = () => createStyles({
  loginButton: {
    marginLeft: "auto"
  },
  toolbar: {
    display: "flex"
  }
})

interface StyleProps extends WithStyles<typeof styles> { }

class Header extends React.Component<StyleProps> {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar >
            <Link href="/" passHref>
              <Button>Home</Button>
            </Link>
            <NoSsr>
              {
                isLoggedIn() ?
                  <Link href="/dashboard" passHref>
                    <Button>Dashboard</Button>
                  </Link>
                  :
                  null
              }
              {
                isLoggedIn() ?
                  <Button
                    className={this.props.classes.loginButton}
                    onClick={() => {
                      User.logout().then(_d => {
                        Router.push('/');
                      })
                    }}
                  >Logout</Button>
                  :
                  <Link href="/login" passHref>
                    <Button className={this.props.classes.loginButton}>Login</Button>
                  </Link>
              }
            </NoSsr>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(Header)