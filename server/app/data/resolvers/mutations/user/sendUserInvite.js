import { UserInputError } from 'apollo-server-express';
import UserInviteModel from '../../models/UserInviteModel';
import UserModel from '../../models/UserModel';
import sendGridEmail, { SENGRID_TEMPLATE_IDS } from '../../../utils/send-grid-mail';

export default (pubsub) => {
  return async (_, args, context) => {
    const { email } = args;
    const { user } = context;

    if (!user) {
      throw new UserInputError('Authentication required');
    }

    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new UserInputError('User with this email already exists');
      }

      // Check if invite already exists
      const existingInvite = await UserInviteModel.findOne({
        email,
        _inviterId: user._id,
      });
      if (existingInvite) {
        throw new UserInputError('Invite already sent to this email');
      }

      // Create new invite
      const invite = new UserInviteModel({
        email,
        _inviterId: user._id,
        status: 'pending',
      });

      await invite.save();

      // Send invitation email
      const clientUrl = process.env.CLIENT_URL;
      const mailOptions = {
        to: email,
        from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
        subject: `You've been invited to join Quote.Vote by ${user.username}`,
        templateId: SENGRID_TEMPLATE_IDS.INVITE_REQUEST_RECEIVED_CONFIRMATION,
        dynamicTemplateData: {
          inviter_name: user.name || user.username,
          invite_url: `${clientUrl}/auth/signup?invite=${invite._id}`,
        },
      };

      await sendGridEmail(mailOptions);

      return {
        code: 'SUCCESS',
        message: 'Invitation sent successfully',
        invite,
      };
    } catch (error) {
      console.error('Error sending user invite:', error);
      throw error;
    }
  };
};
