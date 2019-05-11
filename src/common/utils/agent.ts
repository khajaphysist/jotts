import fetch from 'isomorphic-unfetch';
import { CookieUser } from '../types';

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
        const res =  await fetch('/login', {
            body,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(res.status === 401){
            return 'unauthorized' as const
        }
        if(res.status !== 200){
            return 'unknown_error' as const
        }
        const {user, token}:{user:CookieUser, token:string} = await res.json()
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user
    },
    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}