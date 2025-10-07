import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { addCreatorToUser } from '~/utils/authentication';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';

export const sendPasswordResetEmail = (pubsub) => {
  return async (_, args) => {
    try {
      const { email } = args;
      const user = await UserModel.findOne({ email });
      if (user) {
        //  ***   Send the email   ***
        const { username } = user;
        const expiresIn = 60 * 60; // seconds * minutes
        const token = await addCreatorToUser(
          {
            username,
            password: '',
            requirePassword: false,
          },
          () => {},
          false,
          expiresIn,
          true,
        );
        const clientUrl = process.env.CLIENT_URL;
        const mailOptions = {
          to: email,
          from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
          templateId: SENGRID_TEMPLATE_IDS.PASSWORD_RESET,
          dynamicTemplateData: {
            change_password_url: `${clientUrl}/auth/password-reset?token=${token}&username=${username}`,
          },
        };

        await sendGridEmail(mailOptions);

        return user;
      }
      throw new UserInputError('Email not found', {
        invalidArgs: Object.keys(args),
      });
    } catch (err) {
      logger.error(JSON.stringify(err));
      throw `Update failed! ${err}`;
    }
  };
};
