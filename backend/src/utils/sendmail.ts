import { transporter } from '../config/nodemailer';

interface SendMailOptions {
  userEmail: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({
  userEmail,
  subject,
  text,
  html,
}: SendMailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.SENDER_EMAIL}>`,
      to: userEmail,
      subject,
      text,
      html,
    });

    console.log(
      "✅ Email sent successfully to:",
      userEmail,
      "| Message ID:",
      info.messageId
    );
  } catch (err: any) {
    console.error("❌ Failed to send email:", err.message);
  }
};
