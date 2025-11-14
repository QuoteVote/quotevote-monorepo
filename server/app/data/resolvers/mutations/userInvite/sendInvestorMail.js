import { sendEmail } from './sendEmail';
import UserModel from '~/resolvers/models/UserModel';
import { logger } from '../../../utils/logger';

export const sendInvestorMail = (pubsub) => {
  return async (_, args) => {
    const { email } = args;
    logger.debug('checking mail for', { email });

    const existingUser = await UserModel.findOne({ email });
    logger.debug('Existing user', { email, hasUser: !!existingUser });
    let user;
    if (!existingUser) {
      const tempName = (email.split('@'))[0];
      const userArgs = {
        username: tempName.toLowerCase(), // temporary
        name: tempName, // temporary
        email,
        status: 1, // prospect,
        plan: 'investor',
      };
      user = await new UserModel(userArgs).save();
    }
    //  ***   Send the email   ***
    const mailOptions = {
      to: process.env.TO_INVESTOR_EMAIL,
      from: '"Quote.vote Investor" <invest@quote.vote>',
      subject: `New Investor - ${email}`,
      html: `
          <p>New investor ${email}</p>
          `,
    };

    const sendMailResult = await sendEmail(mailOptions);
    if (sendMailResult) {
      logger.info('User invite sent successfully', { email, toInvestorEmail: process.env.TO_INVESTOR_EMAIL });
    } else {
      logger.warn('Mail transporter failed to return a response', { email });
    }

    return user || existingUser;
  };
};
