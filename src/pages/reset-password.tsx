import React from "react";
import Layout from "../common/components/Layout";
import { TextField, Button } from "@material-ui/core";
import { NextContext, GetInitialProps } from "next";

interface InitialProps{
    token: string
}
interface State{
    password: string
    confirmPassword: string
}
type Props = InitialProps

class ResetPassword extends React.Component<Props, State>{
    public static getInitialProps: GetInitialProps<InitialProps, NextContext> = (ctx) => {
        const p = ctx.query['token'];
        const token = p && !(p instanceof Array) ? p : '';
        return {
            token
        }
    }
    constructor(props: Props) {
        super(props)
        this.state = { password: '', confirmPassword: '' }
    }
    render() {
        return (
            <Layout>
                <div style={{display:"flex", flexDirection: "column"}}>
                <TextField label="New Password" style={{ width: 300 }} type="password" onChange={e => this.setState({ ...this.state, password: e.target.value })} />
                <TextField label="Confirm New Password" style={{ width: 300 }} type="password" onChange={e => this.setState({ ...this.state, confirmPassword: e.target.value })} />
                <Button onClick={() => {
                    const { password, confirmPassword } = this.state
                    if(password !== confirmPassword){
                        return window.alert("Passwords do not match")
                    }
                    if(!password || password.length<6){
                        return window.alert("Password should be of minimum length 6")
                    }
                    fetch('/reset-password', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ newPassword: password, token: this.props.token })
                    }).then(res => {
                        if (res.status === 200) {
                            window.alert("Password successfully reset. Login with the new password");
                            window.location.href='/login'
                        } else {
                            window.alert("Some error occurred");
                        }
                    })
                }}>Reset</Button>
                </div>
            </Layout>
        )
    }
}

export default ResetPassword