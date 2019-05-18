import React from "react";
import Layout from "../common/components/Layout";
import { TextField, Button } from "@material-ui/core";

class ForgotPassword extends React.Component<{}, { email: string }>{
    constructor(props: {}) {
        super(props)
        this.state = { email: '' }
    }
    render() {
        return (
            <Layout>
                <TextField label="Email" style={{ width: 300 }} type="email" inputProps={{autoComplete:"email"}} onChange={e => this.setState({ ...this.state, email: e.target.value })} />
                <Button onClick={() => {
                    const {email} = this.state
                    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!email || !re.test(String(email).toLowerCase())) {
                        window.alert("Invalid Email")
                    }
                    fetch('/forgot-password', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email })
                    }).then(res=>{
                        if(res.status===200){
                            window.alert("An email will be sent if the email exists in our records. Please check your email for next steps to reset password");
                        }else {
                            window.alert("Some error occurred");
                        }
                    })
                }}>Send</Button>
            </Layout>
        )
    }
}

export default ForgotPassword