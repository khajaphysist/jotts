import { CookieUser } from '../types';

export const isLoggedIn = (): boolean => {
    if(process.browser && localStorage.getItem('token') && localStorage.getItem('user')){
        return true;
    }
    return false;
}

export const loggedInUser = () => {
    const user = localStorage ? localStorage.getItem('user'):undefined;
    return user ? JSON.parse(decodeURIComponent(user)) as CookieUser : undefined;
}

export const getUserToken = () => localStorage.getItem('token');