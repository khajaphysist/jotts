import Link from 'next/link';
import React from 'react';

import {
  AppBar, Button, createStyles, NoSsr, Toolbar, Typography, WithStyles, withStyles
} from '@material-ui/core';

import { CookieUser } from '../types';
import { User } from '../utils/agent';
import { isLoggedIn, loggedInUser } from '../utils/loginStateProvider';

const getDashboardLink = (user: CookieUser | undefined) => {
  if (user) {
    return {
      href: `/dashboard?handle=${user.handle}`,
      as: `/${user.handle}/dashboard`
    }
  }
}

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
    const loginState = isLoggedIn();
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Link href="/" passHref>
              <Typography variant="h6" color="inherit" component='a' style={{ textDecoration: 'none' }}>
                Jotts.io
              </Typography>
            </Link>
            <NoSsr>
              {
                loginState ?
                  <Link {...getDashboardLink(loggedInUser())} passHref>
                    <Button>Dashboard</Button>
                  </Link>
                  :
                  null
              }
              {
                loginState ?
                  <div className={this.props.classes.loginButton}>
                    <Link href="/profile" passHref>
                      <Button className={this.props.classes.loginButton}>Profile</Button>
                    </Link>
                    <Button
                      onClick={() => {
                        User.logout()
                        window.location.href = '/';
                      }}
                    >Logout</Button>
                  </div>
                  :
                  <div className={this.props.classes.loginButton}>
                    <Link href="/login?action=signup" passHref>
                      <Button color="inherit">Sign Up</Button>
                    </Link>
                    <Link href="/login" passHref>
                      <Button color="inherit">Login</Button>
                    </Link>
                  </div>
              }
            </NoSsr>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(Header)