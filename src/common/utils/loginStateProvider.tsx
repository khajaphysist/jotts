import React from 'react';

import { CookieUser } from '../types';

export const isLoggedIn = (): boolean => {
    if (process.browser && localStorage.getItem('token') && localStorage.getItem('user')) {
        return true;
    }
    return false;
}

export const loggedInUser = () => {
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