import Link from 'next/link';
import React from 'react';

import {
  AppBar, Button, createStyles, NoSsr, Toolbar, Typography, WithStyles, withStyles, Avatar, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem
} from '@material-ui/core';

import { CookieUser } from '../types';
import { User } from '../utils/agent';
import { loggedInUser } from '../utils/loginStateProvider';
import { s3ImagePrefix } from '../vars';
import { deepOrange } from '@material-ui/core/colors';

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
    marginLeft: "auto",
    display: "flex"
  },
  toolbar: {
    display: "flex"
  }
})

interface StyleProps extends WithStyles<typeof styles> { }
type Props = StyleProps;
interface State {
  open: boolean
}

class Header extends React.Component<Props, State> {
  private anchorRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props)
    this.anchorRef = React.createRef()
    this.state = { open: false }
  }
  handleClose = () => {
    this.setState({ ...this.state, open: false })
  }
  render() {
    const user = loggedInUser();
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Link href="/" passHref>
              <Typography variant="h6" color="inherit" component='a' style={{ textDecoration: 'none' }}>
                Jotts.io
              </Typography>
            </Link>

            <div style={{ marginLeft: "50%" }}>
              {
                user ? (
                  <Link {...getDashboardLink(user)} passHref>
                    <Button color="inherit">Dashboard</Button>
                  </Link>
                ) : null
              }
              <Link href="/explore" passHref>
                <Button color="inherit">
                  Explore
              </Button>
              </Link>
              <Link href="/try" passHref>
                <Button color="inherit">
                  Try Editor
              </Button>
              </Link>
              <Link href="/about" passHref>
                <Button color="inherit">
                  About
              </Button>
              </Link>
            </div>

            <NoSsr>
              {
                user ?
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <div className={this.props.classes.loginButton}>
                      <div ref={this.anchorRef}>
                        {
                          user.profile_picture ?
                            (
                              <Avatar src={s3ImagePrefix + "/" + user.profile_picture} onClick={() => {
                                this.setState({ ...this.state, open: !this.state.open })
                              }} />
                            ) :
                            (
                              <Avatar
                                style={{ backgroundColor: deepOrange[500] }}
                                onClick={() => {
                                  this.setState({ ...this.state, open: !this.state.open })
                                }}
                              >{user.handle.charAt(0).toUpperCase()}</Avatar>
                            )
                        }
                      </div>
                      <Popper
                        open={this.state.open}
                        anchorEl={this.anchorRef.current}
                        transition
                        disablePortal
                        style={{
                          zIndex: 1000,
                          marginTop: 4,
                          position: "absolute",
                          right: 8
                        }}>
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                          >
                            <Paper >
                              <MenuList >
                                <Link href="/profile" passHref>
                                  <MenuItem onClick={this.handleClose}>
                                    Profile
                                    </MenuItem>
                                </Link>

                                <MenuItem onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation()
                                  User.logout()
                                  this.handleClose()
                                  window.location.href = '/';
                                }}
                                >
                                  Logout
                                </MenuItem>
                              </MenuList>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </div>
                  </ClickAwayListener>
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