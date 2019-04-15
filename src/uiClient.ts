import fetch from 'isomorphic-unfetch';

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
        return await fetch('/login', {
            body,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}