import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `TwiLite Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff; text-align: center;">Welcome to TwiLite, ${options.name}!</h2>
        <p style="font-size: 16px;">Thank you for signing up. To complete your registration, please use the following verification code:</p>
        <div style="text-align: center;">
          <span style="font-size: 24px; color: #28a745; font-weight: bold; letter-spacing: 2px;">${options.otp}</span>
        </div>
        <p style="font-size: 16px;">If you didn’t request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #666; text-align: center;">If you don’t see the email in your inbox, please check your Spam or Promotions folder and mark it as "Not Spam".</p>
      </div>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
