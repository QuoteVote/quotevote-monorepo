import { AuthenticationError, UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';

const ALLOWED_STATUSES = ['ONLINE', 'AWAY', 'OFFLINE'];

export const updatePresenceStatus = () => {
  return async (_, args, context) => {
    const { user } = context;

    if (!user || !user._id) {
      throw new AuthenticationError('You must be authenticated to update presence.');
    }

    const { presence } = args;

    if (!presence || !presence.status) {
      throw new UserInputError('A presence status is required.');
    }

    const status = presence.status.toUpperCase();

    if (!ALLOWED_STATUSES.includes(status)) {
      throw new UserInputError(`Unsupported presence status: ${presence.status}`);
    }

    const awayMessage = presence.awayMessage || '';
    const trimmedAwayMessage = awayMessage.trim();
    const update = {
      presenceStatus: status,
      lastActiveAt: new Date(),
      awayMessage: status === 'AWAY' ? trimmedAwayMessage : '',
    };

    await UserModel.updateOne({ _id: user._id }, update);
    const updatedUser = await UserModel.findById(user._id);
    return updatedUser;
  };
};
