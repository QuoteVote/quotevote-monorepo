import sendGridEmail, { SENGRID_TEMPLATE_IDS } from '../../../utils/send-grid-mail'
import UserModel from '../../models/UserModel'
import { UserInputError } from 'apollo-server-express'

export const requestUserAccess = (pubsub) => {
  return async (_, args) => {
    const { requestUserAccessInput } = args
    const { email } = requestUserAccessInput
    console.log('checking mail for', email)

    const existingUser = await UserModel.findOne({ email })
    console.log('Existing user', existingUser)
    let user
    if (!existingUser) {
      const userArgs = {
        username: email,
        email,
        status: 1, // prospect
      }
      user = await new UserModel(userArgs).save()
    }

    if (existingUser.status !== 1) {
      throw new UserInputError('Email already exists', {
        invalidArgs: Object.keys(args),
      })
    }
    const mailOptions = {
      to: email,
      from: `Team Quote.Vote <${process.env.SENDGRID_SENDER_EMAIL}>`,
      templateId: SENGRID_TEMPLATE_IDS.INVITE_REQUEST_RECEIVED_CONFIRMATION,
    }

    const result = await sendGridEmail(mailOptions);

    if(result.error) {
      throw new Error(error)
    }


    return user
  }
}
