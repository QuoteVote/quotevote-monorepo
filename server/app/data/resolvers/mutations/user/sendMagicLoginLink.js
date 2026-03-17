import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';
import { addCreatorToUser } from '~/utils/authentication';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';

export const sendMagicLoginLink = () => {
  return async (_, args, context) => {
    try {
      const { email } = args;
      const requestId = context && context.requestId;
      logger.info('sendMagicLoginLink called', {
        requestId,
        email,
      });

      const user = await UserModel.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });

      if (!user) {
        logger.info('sendMagicLoginLink returning generic success for unknown account', {
          requestId,
          email,
        });
        // Don't reveal whether email exists — return generic success
        return { success: true, message: 'If an account exists with that email, a login link has been sent.' };
      }

      if (!user.hash_password) {
        logger.info('sendMagicLoginLink blocked because password not set', {
          requestId,
          email,
          userId: user._id,
          userStatus: user.status,
        });
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
        requestId,
        to: email,
        from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
        templateId: SENGRID_TEMPLATE_IDS.MAGIC_LOGIN,
        dynamicTemplateData: {
          MAGIC_LINK_URL: `${clientUrl}/auth/magic-login?token=${token}`,
        },
      };

      logger.info('sendMagicLoginLink sending email', {
        requestId,
        email,
        hasClientUrl: !!clientUrl,
        hasSendgridApiKey: !!process.env.SENDGRID_API_KEY,
        hasSenderEmail: !!process.env.SENDGRID_SENDER_EMAIL,
      });

      const sendResult = await sendGridEmail(mailOptions);

      logger.info('sendMagicLoginLink sendGrid result', {
        requestId,
        email,
        success: !!sendResult.success,
        error: sendResult.error || null,
      });

      return { success: true, message: 'If an account exists with that email, a login link has been sent.' };
    } catch (err) {
      logger.error('Error in sendMagicLoginLink', {
        requestId: context && context.requestId,
        error: err.message,
      });
      throw new Error(`Failed to send magic login link: ${err.message}`);
    }
  };
};
