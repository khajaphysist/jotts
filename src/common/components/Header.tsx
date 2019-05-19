import Link from 'next/link';
import React from 'react';

import {
  AppBar, Button, createStyles, NoSsr, Toolbar, WithStyles, withStyles
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
          <Toolbar >
            <Link href="/" passHref>
              <Button>Home</Button>
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