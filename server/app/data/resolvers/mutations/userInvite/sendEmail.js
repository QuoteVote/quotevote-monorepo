const nodemailer = require('nodemailer');

export const sendEmail = async function (options) {
  console.log(options);
  console.log('Sending email: host %s smtp %s', process.env.SMTP_HOST, process.env.SMTP_USER);

  const smtpConfig = {
    from: process.env.FROM_EMAIL,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: true,
    transportMethod: 'SMTP',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  console.log(smtpConfig.host);

  const transporter = nodemailer.createTransport(smtpConfig);
  const transportResponse = await transporter.sendMail(options);

  console.log('Transporter returned with', transportResponse);
  return transportResponse;
};
