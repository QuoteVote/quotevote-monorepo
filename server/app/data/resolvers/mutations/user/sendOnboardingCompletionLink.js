import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { addCreatorToUser } from '~/utils/authentication';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';

export const sendOnboardingCompletionLink = () => {
  return async (_, args, context) => {
    try {
      const { email } = args;
      const requestId = context && context.requestId;
      logger.info('sendOnboardingCompletionLink called', {
        requestId,
        email,
      });

      const user = await UserModel.findOne({
        email: {
          $regex: new RegExp(
            `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
            'i',
          ),
        },
      });

      if (!user || user.hash_password || user.status !== 4) {
        logger.info('sendOnboardingCompletionLink returning generic success for ineligible account', {
          requestId,
          email,
          hasUser: !!user,
          userStatus: user ? user.status : null,
          hasPassword: user ? !!user.hash_password : null,
        });
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
        requestId,
        to: email,
        from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
        templateId: SENGRID_TEMPLATE_IDS.INVITATION_APPROVE,
        dynamicTemplateData: {
          create_password_url: `${clientUrl}/auth/signup?token=${token}`,
        },
      };

      logger.info('sendOnboardingCompletionLink sending email', {
        requestId,
        email,
        userId: user._id,
        hasClientUrl: !!clientUrl,
        hasSendgridApiKey: !!process.env.SENDGRID_API_KEY,
        hasSenderEmail: !!process.env.SENDGRID_SENDER_EMAIL,
      });

      const sendResult = await sendGridEmail(mailOptions);

      logger.info('sendOnboardingCompletionLink sendGrid result', {
        requestId,
        email,
        success: !!sendResult.success,
        error: sendResult.error || null,
      });

      return {
        success: true,
        message:
          'If an eligible account exists with that email, an onboarding link has been sent.',
      };
    } catch (err) {
      logger.error('Error in sendOnboardingCompletionLink', {
        requestId: context && context.requestId,
        error: err.message,
      });
      throw new Error(
        `Failed to send onboarding completion link: ${err.message}`,
      );
    }
  };
};
