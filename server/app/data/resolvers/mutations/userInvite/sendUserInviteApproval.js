import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail';
import UserModel from '../../models/UserModel';
import { addCreatorToUser } from '~/utils/authentication';

export const sendUserInviteApproval = (pubsub) => {
  return async (_, args, context) => {
    // AUTHENTICATION CHECK: Require user to be authenticated
    if (!context.user) {
      throw new AuthenticationError('Authentication required to approve invites');
    }

    // AUTHORIZATION CHECK: Only admins can approve/decline invites
    if (!context.user.admin) {
      throw new ForbiddenError('Admin access required to approve or decline invites');
    }

    const { userId } = args;
    const invitedUser = await UserModel.findById(userId);
    
    // VALIDATION: Check if user exists
    if (!invitedUser) {
      throw new Error('User not found');
    }
    
    const nextStatus = parseInt(args.inviteStatus, 10);
    const currentStatus = invitedUser.status;

    // VALIDATION: Check allowed status transitions
    if (nextStatus === 4 || nextStatus === 2) {
      // Approve or decline only from pending
      if (currentStatus !== 1) {
        throw new Error('Only pending invites can be approved or declined');
      }
    } else if (nextStatus === 1) {
      // Reset only from declined (or accepted if resend flow)
      if (![2, 4].includes(currentStatus)) {
        throw new Error('Only declined or accepted invites can be reset to pending');
      }
    } else {
      throw new Error('Unsupported invite status transition');
    }
    
    invitedUser.status = nextStatus;
    await UserModel.update({ _id: userId }, invitedUser, {
      upsert: true,
      new: true,
    });
    const mailTo = invitedUser.email;
    const clientUrl = process.env.CLIENT_URL;
    const mailOptions = {
      to: mailTo, // list of receivers
      from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`, // sender address
    };

    if (nextStatus === 4) {
      // Approved
      const expiresIn = 60 * 60 * 24; // 1 day
      const token = await addCreatorToUser(
        {
          username: invitedUser.username,
          password: '',
          requirePassword: false,
        },
        () => {},
        false,
        expiresIn,
        true,
      );
      mailOptions.subject = 'Your invitation to Quote is approved';
      mailOptions.templateId = SENGRID_TEMPLATE_IDS.INVITATION_APPROVE;
      mailOptions.dynamicTemplateData = {
        create_password_url: `${clientUrl}/auth/signup?token=${token}`,
      };
    } else if (nextStatus === 2) {
      // Declined
      mailOptions.subject = 'Your invitation to Quote has been declined';
      mailOptions.templateId = SENGRID_TEMPLATE_IDS.INVITATION_DECLINE;
    } else {
      return {
        code: 'SUCCESS',
        message: 'User Invite reset',
      };
    }
    const email = await sendGridEmail(mailOptions);

    //  ***   TODO test to see if email was sent   ***
    if (email) {
      return {
        code: 'SUCCESS',
        message: `User sign-up invite sent successfully to ${mailTo}.`,
      };
    }
    console.log('no email returned');
    return {
      code: 'FAILURE',
      message: 'Mail transporter failed to return a response',
    };
  };
};
