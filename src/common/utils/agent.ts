import fetch from 'isomorphic-unfetch';

import { CookieUser } from '../types';
import { getUserToken } from './loginStateProvider';

export const User = {
    register: async (email: string, handle: string, password: string) => {
        const body = JSON.stringify({ email, handle, password });
        return await fetch('/register', {
            body,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
    },
    login: async (username: string, password: string) => {
        const body = JSON.stringify({ username, password });
        const res = await fetch('/login', {
            body,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status === 401) {
            return 'unauthorized' as const
        }
        if (res.status !== 200) {
            return 'unknown_error' as const
        }
        const { user, token }: { user: CookieUser, token: string } = await res.json()
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user
    },
    changePassword: async (oldPassword: string, newPassword: string) => {
        const token = getUserToken()
        if (!token) {
            return 'not_logged_in' as const
        }
        const body = JSON.stringify({ oldPassword, newPassword })
        const res = await fetch('/change-password', {
            body,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        switch (res.status) {
            case 200:
                return 'success' as const
            case 401:
                return 'unauthorized' as const
            default:
                console.log(res.statusText)
                return 'unknown_error' as const
        }
    },
    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}