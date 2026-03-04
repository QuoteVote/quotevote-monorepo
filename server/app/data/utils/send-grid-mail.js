import sgMail from '@sendgrid/mail';
import { logger } from './logger';

export const SENGRID_TEMPLATE_IDS = {
  INVITE_REQUEST_RECEIVED_CONFIRMATION: 'd-a7c556d6bf014115a764033690e11a01.e6d8c539-e40e-4724-a169-d4912f489afe',
  INVITATION_APPROVE: 'd-87274eb1bc824899aa350b26ad33e8eb.1064787e-b021-478b-8e14-ab7f890f0c53',
  INVITATION_DECLINE: 'd-cbac3519f74f4670915a658877550a75.aacbe956-5240-4692-ab80-d790d728f4c4',
  PASSWORD_RESET: 'd-8be5275161b04a0f85f32b8023ac727f.3f4240d3-9533-44ad-9ac0-ae25b90cee6c',
  MAGIC_LOGIN: 'd-c561351713dc44e48a1fdc6a69c9de4f',
};

/**
 * Send email using SendGrid with ES8 async/await syntax
 * @param {Object} emailData - Email configuration object
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.from - Sender email address (must be verified)
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text version of email
 * @param {string} emailData.html - HTML version of email
 * @param {string} emailData.templateId - SendGrid template ID (optional)
 * @param {Object} emailData.dynamicTemplateData - Dynamic data for template (optional)
 * @returns {Promise<Object>} - Promise that resolves with result object
 */
const sendGridEmail = async (emailData) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    logger.error('SENDGRID_API_KEY environment variable is not set');
    throw new Error('SENDGRID_API_KEY environment variable is not set');
  }

  sgMail.setApiKey(apiKey);

  // Validate required fields
  if (!emailData.to) {
    throw new Error('Recipient email (to) is required');
  }

  const from = emailData.from
  || `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`; // sender address

  const msg = {
    ...emailData,
    from,
    content: [
      {
        type: 'text/plain',
        value: 'Plain Content',
      },
      {
        type: 'text/html',
        value: 'HTML Content',
      },
    ],
    personalizations: [
      {
        to: emailData.to,
        dynamicTemplateData: emailData.dynamicTemplateData,
      },
    ],
  };

  logger.debug('sendGridEmail', {
    to: emailData.to,
    from: emailData.from || `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
    subject: emailData.subject,
    hasTemplateId: !!emailData.templateId,
  });

  try {
    await sgMail.send(msg);
    logger.info('Email sent successfully', { to: emailData.to, subject: emailData.subject });
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    logger.error('Error sending email', {
      error: error.message,
      to: emailData.to,
      stack: error.stack,
    });

    if (error.response) {
      logger.error('SendGrid API Error', {
        error: error.response.body,
        to: emailData.to,
      });

      // Handle specific SendGrid errors
      if (error.response.body && error.response.body.errors) {
        const { errors } = error.response.body;
        errors.forEach((err) => {
          if (err.message.includes('authorization grant is invalid')) {
            logger.error('SendGrid API Key Error: Please check your SENDGRID_API_KEY environment variable', {
              error: err.message,
            });
          }
        });
      }
    }

    return {
      success: false,
      error: error.message,
      details: error.response ? error.response.body : null,
    };
  }
};

export default sendGridEmail;
