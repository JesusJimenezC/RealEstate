import nodemailer from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";

const registerEmail = async (
  name: string,
  email: string,
  token: string,
): Promise<void> => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: process.env.MT_HOST,
      port: parseInt(process.env.MT_PORT!),
      secure: false,
      auth: {
        user: process.env.MT_USER,
        pass: process.env.MT_PASSWORD,
      },
    });

  await transporter.sendMail({
    from: "RealEstate.com",
    to: email,
    subject: "Verify your email in RealEstate.com",
    text: "Verify your email in RealEstate.com",
    html: `
      <h1>Hello ${name}</h1>
      <p>Click on the following link to verify your email:</p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/verify/${token}">Verify email</a>
      <p>If you did not create the account, just ignore this email.</p>
    `,
  });
};

const emailForgotPassword = async (
  name: string,
  email: string,
  token: string,
): Promise<void> => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: process.env.MT_HOST,
      port: parseInt(process.env.MT_PORT!),
      secure: false,
      auth: {
        user: process.env.MT_USER,
        pass: process.env.MT_PASSWORD,
      },
    });

  await transporter.sendMail({
    from: "RealEstate.com",
    to: email,
    subject: "Reset your password in RealEstate.com",
    text: "Reset your password in RealEstate.com",
    html: `
      <h1>Hello ${name}, you have requested to reset your password in RealEstate.com</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/reset-password/${token}">Verify email</a>
      <p>If you did not ask for this password change, just ignore this email.</p>
    `,
  });
};

export { registerEmail, emailForgotPassword };
