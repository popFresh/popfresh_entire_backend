import sendEmail from "../services/email/email.service.js";

export const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await sendEmail({
      to: email,
      subject: "Welcome to PopFresh 🚀",
      html: `
        <h2>Welcome to PopFresh</h2>
        <p>Your email integration is working successfully.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};