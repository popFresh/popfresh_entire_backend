import { baseTemplate } from "./baseEmail.js";

export const passwordResetTemplate=(name,resetLink)=>
baseTemplate({

heading:"Reset Your Password 🔒",

content:`

<p>Hello ${name},</p>

<p>We received a request to reset your password.</p>

<p>If you requested this change, click the button below to create a new password.</p>

<p>This link will expire in 15 minutes.</p>

<p>If you didn't request a password reset, you can safely ignore this email.</p>

`,

buttonText:"Reset Password",

buttonUrl:resetLink

});