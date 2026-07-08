import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==============================================
// SEND PASSWORD RESET EMAIL
// ==============================================

export const sendPasswordResetEmail = async ({
  name,
  email,
  token,
}) => {

  const resetLink =
    `${process.env.ADMIN_FRONTEND_URL}/reset-password/${token}`;

  const { data, error } =
    await resend.emails.send({

      from: "PopFresh Admin <admin@popfresh.in>",

      to: email,

      subject: "Reset Your PopFresh Admin Password",

      html:  `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>Reset Password</title>

</head>

<body
  style="
    margin:0;
    padding:40px 15px;
    background:#F6F3EC;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<table
  width="100%"
  cellspacing="0"
  cellpadding="0"
>

<tr>

<td align="center">

<table
  width="620"
  cellspacing="0"
  cellpadding="0"
  style="
    max-width:620px;
    background:#ffffff;
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 25px 70px rgba(0,0,0,.08);
  "
>

<!-- HEADER -->

<tr>

<td
  align="center"
  style="
    padding:42px 20px;
    background:linear-gradient(135deg,#174C35,#032F23);
  "
>

<img
  src="https://www.popfresh.in/assets/pop_logo_color_new2-BOZFa3dx.png"
  alt="Pop Fresh"
  style="
    height:74px;
    display:block;
    margin:auto;
  "
>

<div
  style="
    display:inline-block;
    margin-top:24px;
    padding:10px 22px;
    background:#D4B56A;
    color:#174C35;
    border-radius:999px;
    font-size:12px;
    font-weight:bold;
    letter-spacing:2px;
  "
>

PASSWORD RESET

</div>

<h1
  style="
    margin:24px 0 12px;
    color:#ffffff;
    font-size:34px;
    font-family:Georgia,serif;
  "
>

Reset Your Password

</h1>

<p
  style="
    max-width:470px;
    margin:0 auto;
    color:#E5E7EB;
    font-size:16px;
    line-height:28px;
  "
>

A secure password reset request has been received
for your Pop Fresh Admin account.

</p>

</td>

</tr>

<!-- BODY -->

<tr>

<td style="padding:42px;">

<h2
  style="
    margin-top:0;
    color:#174C35;
    font-size:28px;
  "
>

Hello ${name},

</h2>

<p
  style="
    font-size:16px;
    color:#667085;
    line-height:30px;
  "
>

We received a request to reset the password for your
<strong>Pop Fresh Admin Suite</strong> account.

If this was you, click the button below to
securely create a new password.

</p>

<table
  width="100%"
  cellspacing="0"
  cellpadding="0"
  style="
    margin:35px 0;
    background:#F8F8F5;
    border-radius:18px;
    border:1px solid #ECECEC;
  "
>

<tr>

<td style="padding:24px;">

<div
  style="
    font-size:13px;
    color:#98A2B3;
    text-transform:uppercase;
    letter-spacing:1px;
  "
>

Security Notice

</div>

<p
  style="
    margin:12px 0 0;
    color:#174C35;
    line-height:28px;
    font-size:16px;
  "
>

This password reset link is valid for

<strong>30 minutes</strong>

and can only be used once.

</p>

</td>

</tr>

</table>

<div
  style="
    text-align:center;
    margin:40px 0;
  "
>

<a
  href="${resetLink}"
  style="
    display:inline-block;
    background:#174C35;
    color:white;
    text-decoration:none;
    padding:18px 38px;
    border-radius:999px;
    font-weight:bold;
    font-size:15px;
  "
>

Reset Password

</a>

</div>
<p
  style="
    font-size:16px;
    color:#667085;
    line-height:30px;
  "
>

If the button above doesn't work,
copy and paste the following link into your browser.

</p>

<div
  style="
    background:#F6F3EC;
    padding:18px;
    border-radius:14px;
    border:1px solid #ECECEC;
    word-break:break-all;
    font-size:13px;
    color:#2563EB;
    line-height:24px;
  "
>

${resetLink}

</div>

<hr
  style="
    margin:42px 0;
    border:none;
    border-top:1px solid #ECECEC;
  "
>

<div
  style="
    background:#FFF8E8;
    border-left:4px solid #D4B56A;
    border-radius:12px;
    padding:18px 20px;
  "
>

<p
  style="
    margin:0;
    color:#7A5B16;
    font-size:15px;
    line-height:28px;
  "
>

<strong>Didn't request this?</strong>

If you did not request a password reset,
you can safely ignore this email.
Your password will remain unchanged and
no further action is required.

</p>

</div>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
  align="center"
  style="
    background:#FAFAF8;
    padding:34px 24px;
    border-top:1px solid #ECECEC;
  "
>

<h3
  style="
    margin:0;
    color:#174C35;
    font-family:Georgia,serif;
    font-size:24px;
  "
>

Healthy Snacking. Bold Flavours. Perfect Crunch.

</h3>

<p
  style="
    margin:20px 0 8px;
    color:#667085;
    font-size:14px;
  "
>

🌐 www.popfresh.in

</p>

<p
  style="
    margin:8px 0;
    color:#667085;
    font-size:14px;
  "
>

📸 @popfresh.in

</p>

<p
  style="
    margin:8px 0;
    color:#667085;
    font-size:14px;
  "
>

✉️ hello@popfresh.in

</p>

<p
  style="
    margin-top:28px;
    color:#98A2B3;
    font-size:12px;
    line-height:22px;
  "
>

This is a system generated email from the
<strong>Pop Fresh Admin Platform</strong>.

Please do not reply to this email.

<br><br>

For any assistance,
contact us at
<strong>hello@popfresh.in</strong>.

</p>

<p
  style="
    margin-top:22px;
    font-size:12px;
    color:#98A2B3;
  "
>

© ${new Date().getFullYear()} Pop Fresh.
All Rights Reserved.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`

    });

  if (error) {
    throw new Error(error.message);
  }

  return data;

};