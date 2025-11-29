import nodemailer from 'nodemailer';

export const sendMail = async (userEmail: string, subject: string, text: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    transporter.verify((err, success) => {
      if (err) console.error("SMTP verification failed:", err.message);
      else console.log("SMTP verification successful:", success);
    });

    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.SENDER_EMAIL}>`    ,
      to: userEmail,
      subject: subject,
      text: text,
    });

    console.log("✅ Email sent successfully to:", userEmail, "| Message ID:", info.messageId);
  } catch (err: any) {
    console.error("❌ Failed to send email:", err.message);
  }
};
