import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { addCreatorToUser } from '~/utils/authentication';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';

export const sendOnboardingCompletionLink = () => {
  return async (_, args) => {
    try {
      const { email } = args;
      const user = await UserModel.findOne({
        email: {
          $regex: new RegExp(
            `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
            'i',
          ),
        },
      });

      if (!user || user.hash_password || user.status !== 4) {
        return {
          success: true,
          message:
            'If an eligible account exists with that email, an onboarding link has been sent.',
        };
      }

      const expiresIn = 60 * 60 * 24;
      const token = await addCreatorToUser(
        {
          username: user.username,
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
        templateId: SENGRID_TEMPLATE_IDS.INVITATION_APPROVE,
        dynamicTemplateData: {
          create_password_url: `${clientUrl}/auth/signup?token=${token}`,
        },
      };

      await sendGridEmail(mailOptions);

      return {
        success: true,
        message:
          'If an eligible account exists with that email, an onboarding link has been sent.',
      };
    } catch (err) {
      logger.error('Error in sendOnboardingCompletionLink', {
        error: err.message,
      });
      throw new Error(
        `Failed to send onboarding completion link: ${err.message}`,
      );
    }
  };
};
