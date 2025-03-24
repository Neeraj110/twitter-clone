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

  let mailOptions;
  if (options.otp) {
    // Registration email
    mailOptions = {
      from: `TwiLite Support <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007bff; text-align: center;">${
            options.subject
          }</h2>
          <p style="font-size: 16px;">Dear ${options.name || "User"},</p>
          <p style="font-size: 16px;">Thank you for choosing TwiLite. Please use the following verification code to complete your action:</p>
          <div style="text-align: center;">
            <span style="font-size: 24px; color: #28a745; font-weight: bold; letter-spacing: 2px;">${
              options.otp
            }</span>
          </div>
          <p style="font-size: 16px;">If you didn’t request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666; text-align: center;">Check your Spam or Promotions folder if you don’t see this email in your inbox.</p>
        </div>
      `,
    };
  } else {
    // Forgot password email
    mailOptions = {
      from: `TwiLite Support <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
