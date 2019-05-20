import * as nodemailer from 'nodemailer';

import { ADMIN_EMAIL, ADMIN_EMAIL_PASS } from './vars';

const resetPasswordUrl = "https://jotts.io/reset-password"

export async function sendResetPasswordMail(email:string, token:string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ADMIN_EMAIL,
            pass: ADMIN_EMAIL_PASS
        }
    });

    const url = `${resetPasswordUrl}?token=${token}`
    const text = `To change password, please visit ${url}`;
    const html = `To change password, please visit <a href="${url}">${url}</a>`;

    try {
        const info:{accepted: string[]} = await transporter.sendMail({
            from: `"jotts.io" <${ADMIN_EMAIL}>`,
            to: email,
            subject: "Reset Password",
            text,
            html
        });
        console.log(info)
        if(info.accepted.includes(email)){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}