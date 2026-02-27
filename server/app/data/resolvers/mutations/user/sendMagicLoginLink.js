import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { addCreatorToUser } from '~/utils/authentication';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';

export const sendMagicLoginLink = () => {
  return async (_, args) => {
    try {
      const { email } = args;
      const user = await UserModel.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!user) {
        // Don't reveal whether email exists — return generic success
        return { success: true, message: 'If an account exists with that email, a login link has been sent.' };
      }

      if (!user.hash_password) {
        return { success: false, message: 'This account has not completed signup yet.' };
      }

      const { username } = user;
      const expiresIn = 15 * 60; // 15 minutes
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
          change_password_url: `${clientUrl}/auth/magic-login?token=${token}`,
        },
      };

      await sendGridEmail(mailOptions);

      return { success: true, message: 'If an account exists with that email, a login link has been sent.' };
    } catch (err) {
      logger.error('Error in sendMagicLoginLink', { error: err.message });
      throw new Error(`Failed to send magic login link: ${err.message}`);
    }
  };
};
