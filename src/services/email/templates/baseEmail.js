export const baseEmail = ({
  badge,
  heading,
 description,
  status,
  delivery,
  receipt,
  buttonText,
  buttonLink,
}) => `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8"/>

<meta
name="viewport"
content="width=device-width,initial-scale=1.0"
/>

<title>Pop Fresh</title>

</head>

<body
style="
margin:0;
padding:32px 15px;
background:#F6F3EC;
font-family:Arial,Helvetica,sans-serif;
color:#174C35;
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
width="600"
cellspacing="0"
cellpadding="0"
style="
max-width:600px;
background:#ffffff;
border-radius:24px;
overflow:hidden;
box-shadow:0 20px 60px rgba(0,0,0,.08);
"
>

<!-- HEADER -->

<tr>

<td
align="center"
style="
background:linear-gradient(135deg,#174C35,#032F23);
padding:38px 24px;
"
>

<img
src="https://www.popfresh.in/assets/pop_logo_color_new2-BOZFa3dx.png"
alt="Pop Fresh"
style="
height:72px;
display:block;
margin:auto;
"
/>

<div
style="
display:inline-block;
margin-top:22px;
padding:9px 18px;
border-radius:999px;
background:#D4B56A;
color:#174C35;
font-size:11px;
font-weight:bold;
letter-spacing:2px;
"
>

${badge}

</div>

<h1
style="
margin:22px 0 12px;
color:white;
font-size:34px;
font-family:Georgia,serif;
"
>

${heading}

</h1>

<p
style="
margin:0 auto;
max-width:440px;
color:#E8E8E8;
font-size:16px;
line-height:28px;
"
>

${description}

</p>

</td>

</tr>

<!-- BODY -->

<tr>

<td style="padding:34px;">

<table
width="100%"
cellspacing="0"
cellpadding="0"
style="
background:#F8F8F5;
border:1px solid #ECECEC;
border-radius:18px;
padding:22px;
"
>

<tr>

<td>

<div
style="
display:flex;
justify-content:space-between;
padding:8px 0;
"
>

<span style="color:#667085;">
Status:
</span>

<strong>&nbsp;
${status}
</strong>

</div>

<div
style="
display:flex;
justify-content:space-between;
padding:8px 0;
"
>

<span style="color:#667085;">
Estimated Delivery:
</span>

<strong>&nbsp;
${delivery}
</strong>

</div>

<div
style="
display:flex;
justify-content:space-between;
padding:8px 0;
"
>

<span style="color:#667085;">
Receipt:
</span>

<strong>&nbsp;
${receipt}
</strong>

</div>

</td>

</tr>

</table>

<div
style="
text-align:center;
margin:36px 0 18px;
"
>

<a
href="${buttonLink}"
style="
display:inline-block;
background:#174C35;
color:white;
text-decoration:none;
padding:17px 34px;
border-radius:999px;
font-weight:bold;
font-size:15px;
"
>

${buttonText}

</a>

</div>
<div
style="
background:#FFF8E8;
border-left:4px solid #D4B56A;
padding:18px 20px;
border-radius:14px;
margin-top:12px;
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

We'll keep you updated throughout your order journey.
If you have any questions regarding your order,
our support team is always happy to help.

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
border-top:1px solid #ECECEC;
padding:28px 24px;
"
>

<h3
style="
margin:0;
font-family:Georgia,serif;
font-size:22px;
color:#174C35;
"
>

Healthy Snacking.
Bold Flavours.
Perfect Crunch.

</h3>

<p
style="
margin:18px 0 6px;
font-size:14px;
color:#667085;
"
>

🌐 www.popfresh.in

</p>

<p
style="
margin:6px 0;
font-size:14px;
color:#667085;
"
>

📧 hello@popfresh.in

</p>

<p
style="
margin-top:22px;
font-size:12px;
line-height:22px;
color:#98A2B3;
"
>

This is a system generated email from
<strong>Pop Fresh</strong>.

Please do not reply to this email.

<br><br>

Need help?

Write to us at

<strong>hello@popfresh.in</strong>

</p>

<p
style="
margin-top:18px;
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

`;

// export const baseTemplate = ({
//   title,
//   heading,
//   content,
//   buttonText,
//   buttonUrl,
// }) => `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
// </head>

// <body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">

// <table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:40px 0;">
// <tr>
// <td align="center">

// <table width="620" cellspacing="0" cellpadding="0"
// style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);">

// <tr>
// <td
// style="background:#16a34a;padding:28px;text-align:center;color:white;font-size:28px;font-weight:bold;">
// 🥬 PopFresh
// </td>
// </tr>

// <tr>
// <td style="padding:40px;">

// <h2 style="margin-top:0;color:#111827;">
// ${heading}
// </h2>

// <div style="color:#4b5563;font-size:16px;line-height:1.8;">
// ${content}
// </div>

// ${
// buttonText
// ? `
// <div style="margin-top:35px;text-align:center;">
// <a href="${buttonUrl}"
// style="
// background:#16a34a;
// color:white;
// padding:14px 32px;
// text-decoration:none;
// border-radius:8px;
// font-weight:bold;
// display:inline-block;">
// ${buttonText}
// </a>
// </div>
// `
// : ""
// }

// </td>
// </tr>

// <tr>
// <td
// style="
// background:#f8fafc;
// padding:25px;
// text-align:center;
// font-size:13px;
// color:#6b7280;">

// Need help?<br>

// Email:
// support@popfresh.in

// <br><br>

// © ${new Date().getFullYear()} PopFresh

// </td>
// </tr>

// </table>

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;