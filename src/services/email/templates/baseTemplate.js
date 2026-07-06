export const baseTemplate = ({
  title,
  heading,
  content,
  buttonText,
  buttonUrl,
}) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:40px 0;">
<tr>
<td align="center">

<table width="620" cellspacing="0" cellpadding="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);">

<tr>
<td
style="background:#16a34a;padding:28px;text-align:center;color:white;font-size:28px;font-weight:bold;">
🥬 PopFresh
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
${heading}
</h2>

<div style="color:#4b5563;font-size:16px;line-height:1.8;">
${content}
</div>

${
buttonText
? `
<div style="margin-top:35px;text-align:center;">
<a href="${buttonUrl}"
style="
background:#16a34a;
color:white;
padding:14px 32px;
text-decoration:none;
border-radius:8px;
font-weight:bold;
display:inline-block;">
${buttonText}
</a>
</div>
`
: ""
}

</td>
</tr>

<tr>
<td
style="
background:#f8fafc;
padding:25px;
text-align:center;
font-size:13px;
color:#6b7280;">

Need help?<br>

Email:
support@popfresh.in

<br><br>

© ${new Date().getFullYear()} PopFresh

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;