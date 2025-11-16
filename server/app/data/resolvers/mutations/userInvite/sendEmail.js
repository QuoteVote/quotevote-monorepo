const nodemailer = require('nodemailer');
import { logger } from '../../../utils/logger';

export const sendEmail = async function (options) {
  logger.debug('sendEmail', {
    to: options.to,
    from: options.from,
    subject: options.subject,
    smtpHost: process.env.SMTP_HOST,
    smtpUser: process.env.SMTP_USER,
  });

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

  logger.debug('SMTP config', { host: smtpConfig.host, port: smtpConfig.port });

  const transporter = nodemailer.createTransport(smtpConfig);
  const transportResponse = await transporter.sendMail(options);

  logger.debug('Transporter response', {
    messageId: transportResponse?.messageId,
    accepted: transportResponse?.accepted,
    rejected: transportResponse?.rejected,
  });
  return transportResponse;
};
