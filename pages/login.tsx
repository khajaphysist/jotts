import Router from 'next/router';
import React from 'react';

import {
  AppBar, Avatar, Button, createStyles, FormControl, Input, InputLabel, Paper, Tab, Tabs, Theme,
  Typography, WithStyles, withStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Layout from '../components/Layout';
import { User } from '../src/uiClient';

const styles = (theme: Theme) => createStyles({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        // marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
})

interface StyleProps extends WithStyles<typeof styles> { };

type Props = StyleProps;

interface State {
    tab: 'login' | 'signup';
    email: string;
    password: string;
    confirm_password?: string;
    handle?: string;
}

class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { tab: 'login', email: '', password: '' }
    }
    render() {
        return (
            <Layout>
                <main className={this.props.classes.main}>
                    <AppBar position="static">
                        <Tabs value={this.state.tab} onChange={(_e, v) => { this.setState({ ...this.state, tab: v }) }} variant="fullWidth">
                            <Tab label="Login" value='login' />
                            <Tab label="Sign Up" value='signup' />
                        </Tabs>
                    </AppBar>
                    {this.state.tab === 'login' &&
                        <Paper className={this.props.classes.paper}>
                            <Avatar className={this.props.classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
            </Typography>
                            <form className={this.props.classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" autoFocus onChange={(e) => { this.setState({ ...this.state, email: e.target.value }) }} required={true} />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input name="password" type="password" id="password" autoComplete="current-password" onChange={(e) => { this.setState({ ...this.state, password: e.target.value }) }} required={true} />
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={this.props.classes.submit}
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        User.login(this.state.email, this.state.password).then(v=>{
                                            if(v.status===200){
                                                Router.push('/')
                                            } else {
                                                window.alert("invalid email or password")
                                            }
                                        });
                                    }}
                                >
                                    Sign in
                </Button>
                            </form>
                        </Paper>}
                    {this.state.tab === 'signup' &&
                        <Paper className={this.props.classes.paper}>
                            <Avatar className={this.props.classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign up
        </Typography>
                            <form className={this.props.classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" autoFocus onChange={(e) => { this.setState({ ...this.state, email: e.target.value }) }} required={true} />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel >Handle</InputLabel>
                                    <Input id="handle" name="handle" onChange={(e) => { this.setState({ ...this.state, handle: e.target.value }) }} required={true} />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input name="password" type="password" id="password" autoComplete="current-password" onChange={(e) => { this.setState({ ...this.state, password: e.target.value }) }} required={true} />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Confirm Password</InputLabel>
                                    <Input name="confirm_password" type="password" id="confirm_password" autoComplete="current-password" onChange={(e) => { this.setState({ ...this.state, confirm_password: e.target.value }) }} required={true} />
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={this.props.classes.submit}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (this.state.password !== this.state.confirm_password) {
                                            window.alert("Passwords do not match");
                                        } else if (!this.state.handle) {
                                            window.alert("handle cannot be empty");
                                        } else {
                                            User.register(this.state.email, this.state.handle, this.state.password);
                                        }
                                    }}
                                >
                                    Sign up
            </Button>
                            </form>
                        </Paper>
                    }
                </main>
            </Layout>
        )
    }
}

export default withStyles(styles)(Login)