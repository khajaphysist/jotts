import Cookie from 'js-cookie';

import { CookieUser } from '../types';

export const isLoggedIn = (): boolean => {
    const user = Cookie.get('user');
    return user ? true : false;
}

export const loggedInUser = () => {
    const user = Cookie.get('user');
    return user ? JSON.parse(decodeURIComponent(user)) as CookieUser : undefined;
}