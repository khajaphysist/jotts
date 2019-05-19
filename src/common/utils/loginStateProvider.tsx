import React from 'react';

import { CookieUser } from '../types';
import { User } from './agent';

export const isLoggedIn = (): boolean => {
    const userStr = process.browser?localStorage.getItem('user'):undefined
    if (process.browser && localStorage.getItem('token') && userStr) {
        const user = JSON.parse(userStr) as CookieUser
        if(user.exp > Math.ceil(Date.now()/1000)){
            return true;
        }else {
            User.logout()
            return false;
        }
    }
    return false;
}

export const loggedInUser = () => {
    if(!isLoggedIn()){
        return undefined;
    }
    const user = process.browser ? localStorage.getItem('user') : undefined;
    return user ? JSON.parse(decodeURIComponent(user)) as CookieUser : undefined;
}

export const getUserToken = () => localStorage.getItem('token');

export function withUser(WrappedComponent: any) {
    const user = loggedInUser()
    return class extends React.Component<any>{
        render() {
            return <WrappedComponent {...this.props} user={user} />
        }
        componentDidMount() {
            this.forceUpdate()
        }
    }
}