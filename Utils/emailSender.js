import nodemailer from "nodemailer";

export const sendMail = async ({ mailFrom, mailTo, subject, body }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    //send mail
    const info = await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error);
  }
};
