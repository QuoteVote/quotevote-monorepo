import { UserInputError } from 'apollo-server-express';
import sendGridEmail, { SENGRID_TEMPLATE_IDS } from '../../../utils/send-grid-mail';
import UserModel from '../../models/UserModel';
import { logger } from '../../../utils/logger';

export const requestUserAccess = (pubsub) => {
  return async (_, args, context) => {
    const { requestUserAccessInput } = args;
    const { email } = requestUserAccessInput;
    const requestId = context && context.requestId;
    logger.debug('checking mail for', { email, requestId });

    const existingUser = await UserModel.findOne({ email });
    logger.debug('Existing user', {
      email,
      requestId,
      hasUser: !!existingUser,
      status: existingUser?.status,
    });
    let user;
    if (existingUser) {
      if (existingUser.status !== 1) {
        throw new UserInputError('Email already exists', {
          invalidArgs: Object.keys(args),
        });
      }
      user = existingUser;
    } else {
      const userArgs = {
        username: email,
        email,
        status: 1, // prospect
      };
      user = await new UserModel(userArgs).save();
    }
    const mailOptions = {
      requestId,
      to: email,
      from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
      templateId: SENGRID_TEMPLATE_IDS.INVITE_REQUEST_RECEIVED_CONFIRMATION,
    };

    logger.info('requestUserAccess sending confirmation email', {
      requestId,
      email,
      userId: user._id,
      hasSendgridApiKey: !!process.env.SENDGRID_API_KEY,
      hasSenderEmail: !!process.env.SENDGRID_SENDER_EMAIL,
    });

    const result = await sendGridEmail(mailOptions);

    logger.info('requestUserAccess sendGrid result', {
      requestId,
      email,
      success: !!result.success,
      error: result.error || null,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    return user;
  };
};
