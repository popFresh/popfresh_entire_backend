import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==============================================
// SEND INVITATION EMAIL
// ==============================================

export const sendInvitationEmail = async ({
  name,
  email,
  role,
  token,
}) => {
  const invitationLink = `${process.env.ADMIN_FRONTEND_URL}/invite/${token}`;

  const { data, error } = await resend.emails.send({
    from: "PopFresh Admin <admin@popfresh.in>",
    to: email,
    subject: "You're invited to join PopFresh",
html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:40px 15px;
  background:#F6F3EC;
  font-family:Arial,Helvetica,sans-serif;
">

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
    box-shadow:0 20px 60px rgba(0,0,0,0.08);
  "
>

  <!-- Header -->

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
      />

      <div
        style="
          display:inline-block;
          margin-top:24px;
          padding:10px 20px;
          background:#D4B56A;
          color:#174C35;
          border-radius:999px;
          font-size:12px;
          font-weight:bold;
          letter-spacing:2px;
        "
      >
        ADMIN INVITATION
      </div>

      <h1
        style="
          color:#ffffff;
          margin:24px 0 10px;
          font-size:34px;
          font-family:Georgia,serif;
        "
      >
        Welcome to Pop Fresh
      </h1>

      <p
        style="
          color:#E5E7EB;
          font-size:16px;
          line-height:28px;
          margin:0 auto;
          max-width:460px;
        "
      >
        You've been invited to join the Pop Fresh Admin Suite.
      </p>

    </td>

  </tr>

  <!-- Body -->

  <tr>

    <td style="padding:42px;">

      <h2
        style="
          margin-top:0;
          color:#174C35;
          font-size:26px;
        "
      >
        Hello ${name},
      </h2>

      <p
        style="
          color:#667085;
          font-size:16px;
          line-height:30px;
        "
      >
        You have been invited to collaborate on the
        <strong>Pop Fresh Admin Dashboard</strong>.
        This dashboard allows you to securely manage
        products, inventory, orders, customers and more.
      </p>

      <!-- Role Card -->

      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          background:#F8F8F5;
          border-radius:18px;
          margin:32px 0;
          border:1px solid #ECECEC;
        "
      >

        <tr>

          <td
            style="
              padding:24px;
            "
          >

            <div
              style="
                color:#98A2B3;
                font-size:13px;
                text-transform:uppercase;
                letter-spacing:1px;
                margin-bottom:10px;
              "
            >
              Assigned Role
            </div>

            <span
              style="
                display:inline-block;
                background:#174C35;
                color:white;
                padding:10px 20px;
                border-radius:999px;
                font-size:14px;
                font-weight:bold;
              "
            >
              ${role}
            </span>

          </td>

        </tr>

      </table>

      <div style="text-align:center;">

        <a
          href="${invitationLink}"
          style="
            display:inline-block;
            background:#174C35;
            color:#ffffff;
            text-decoration:none;
            padding:18px 36px;
            border-radius:999px;
            font-size:15px;
            font-weight:bold;
          "
        >
          Accept Invitation
        </a>

      </div>

      <p
        style="
          margin-top:36px;
          color:#667085;
          line-height:28px;
        "
      >
        This invitation is valid for
        <strong>24 hours</strong>.
        For your security, the invitation link will
        automatically expire after that period.
      </p>

      <p
        style="
          color:#667085;
          line-height:28px;
        "
      >
        If the button above doesn't work,
        copy and paste the following link into your browser:
      </p>

      <div
        style="
          background:#F6F3EC;
          padding:16px;
          border-radius:12px;
          word-break:break-all;
          font-size:13px;
          color:#2563EB;
        "
      >
        ${invitationLink}
      </div>

      <hr
        style="
          margin:40px 0;
          border:none;
          border-top:1px solid #ECECEC;
        "
      />

      <p
        style="
          color:#98A2B3;
          font-size:14px;
          line-height:26px;
        "
      >
        If you weren't expecting this invitation,
        you can safely ignore this email.
      </p>

    </td>

  </tr>

  <!-- Footer -->

  <tr>

    <td
      align="center"
      style="
        background:#FAFAF8;
        padding:32px 24px;
        border-top:1px solid #ECECEC;
      "
    >

      <h3
        style="
          margin:0;
          color:#174C35;
          font-family:Georgia,serif;
        "
      >
        Healthy Snacking. Bold Flavours. Perfect Crunch.
      </h3>

      <p
        style="
          margin:18px 0 8px;
          color:#667085;
        "
      >
        🌐 www.popfresh.in
      </p>

      <p
        style="
          margin:8px 0;
          color:#667085;
        "
      >
        ✉️ hello@popfresh.in
      </p>

      <p
        style="
          margin-top:28px;
          font-size:12px;
          color:#98A2B3;
          line-height:22px;
        "
      >
        This is a system generated email from the Pop Fresh Admin Platform.
        Please do not reply to this email.
        <br /><br />
        For any assistance, contact us at
        <strong>hello@popfresh.in</strong>.
      </p>

      <p
        style="
          margin-top:20px;
          font-size:12px;
          color:#98A2B3;
        "
      >
        © ${new Date().getFullYear()} Pop Fresh. All rights reserved.
      </p>

    </td>

  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};