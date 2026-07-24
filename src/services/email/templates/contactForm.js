export const contactEmailTemplate = ({
  name,
  email,
  phone,
  message,
}) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>

<body style="margin:0;padding:40px;background:#F6F3EC;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;padding:32px;">

<h2 style="color:#184C35;margin-top:0;">
New Contact Form Submission
</h2>

<table style="width:100%;border-collapse:collapse;">
<tr>
<td style="padding:10px 0;"><strong>Name</strong></td>
<td>${name}</td>
</tr>

<tr>
<td style="padding:10px 0;"><strong>Email</strong></td>
<td>${email}</td>
</tr>

<tr>
<td style="padding:10px 0;"><strong>Phone</strong></td>
<td>${phone}</td>
</tr>
</table>

<hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

<h3 style="color:#184C35;">Message</h3>

<p style="white-space:pre-line;">
${message}
</p>

</div>

</body>
</html>
`;