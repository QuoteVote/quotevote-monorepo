import sendGridEmail, {
  SENGRID_TEMPLATE_IDS,
} from '../../../utils/send-grid-mail'
import UserModel from '../../models/UserModel'
import { addCreatorToUser } from '~/utils/authentication'

export const sendUserInviteApproval = (pubsub) => {
  return async (_, args) => {
    const userId = args.userId
    const invitedUser = await UserModel.findById(userId)
    invitedUser.status = args.inviteStatus
    await UserModel.update({ _id: userId }, invitedUser, {
      upsert: true,
      new: true,
    })
    const mailTo = invitedUser.email
    const clientUrl = process.env.CLIENT_URL
    let mailOptions = {
      to: mailTo, // list of receivers
      from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`, // sender address
    }

    if (parseInt(args.inviteStatus) === 4) {
      // Approved
      const expiresIn = 60 * 60 * 24 // 1 day
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
      )
      mailOptions.subject = 'Your invitation to Quote is approved'
      mailOptions.templateId = SENGRID_TEMPLATE_IDS.INVITATION_APPROVE
      mailOptions.dynamicTemplateData = {
        create_password_url: `${clientUrl}/auth/signup?token=${token}`,
      }
    } else if (parseInt(args.inviteStatus) === 2) {
      // Declined
      mailOptions.subject = 'Your invitation to Quote has been declined'
      mailOptions.templateId = SENGRID_TEMPLATE_IDS.INVITATION_DECLINE
    } else {
      return {
        code: 'SUCCESS',
        message: `User Invite reset`,
      }
    }
    const email = await sendGridEmail(mailOptions)

    //  ***   TODO test to see if email was sent   ***
    if (email) {
      return {
        code: 'SUCCESS',
        message: `User sign-up invite sent successfully to ${mailTo}.`,
      }
    }
    console.log('no email returned')
    return {
      code: 'FAILURE',
      message: 'Mail transporter failed to return a response',
    }
  }
}
