import nodemailer from 'nodemailer'

export  const transporter = nodemailer.createTransport({
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