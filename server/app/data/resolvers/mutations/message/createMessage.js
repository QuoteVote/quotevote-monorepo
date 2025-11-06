import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import MessageModel from '~/resolvers/models/MessageModel';
import { createUserMessageRoom } from '~/resolvers/mutations/message/createUserMessageRoom';
import { createPostMessageRoom } from '~/resolvers/mutations/message/createPostMessageRoom';
import { pubsub } from '~/resolvers/subscriptions';
import { MUTATION_CREATED } from '~/resolvers/constants/common';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import TypingModel from '~/resolvers/models/TypingModel';
import { checkRateLimit } from '~/utils/rateLimiter';

// eslint-disable-next-line import/prefer-default-export
export const createMessage = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] createMessage');

    let {
      type, text, title, messageRoomId, componentId,
    } = args.message;

    const { user } = context;
    const userDetails = await UserModel.findById(user._id);

    // Rate limiting: 10 messages per minute
    try {
      checkRateLimit(user._id.toString(), 'sendMessage', 10, 60000);
    } catch (error) {
      throw new UserInputError(error.message);
    }

    // Find or create a message room.
    let messageRoom;

    if (!messageRoomId) {
      if (type === 'USER') {
        messageRoom = await createUserMessageRoom(args, context);
      } else if (type === 'POST') {
        messageRoom = await createPostMessageRoom()(_, { postId: componentId }, context);
      }
    } else {
      messageRoom = await MessageRoomModel.findById(messageRoomId);
    }

    if (!messageRoom) {
      throw new UserInputError('Unable to create message, could not find messageRoom.', {
        invalidArgs: Object.keys(args),
      });
    }

    if (!text) {
      throw new UserInputError('Invalid arguments', {
        invalidArgs: Object.keys(args),
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    messageRoomId = messageRoom._id;

    // Clear typing indicator when message is sent
    await TypingModel.deleteOne({ messageRoomId, userId: user._id });

    // Update room's last activity
    messageRoom.lastActivity = new Date();
    await messageRoom.save();

    const userMessage = await new MessageModel({
      messageRoomId,
      userId: user._id,
      text,
      title,
      created: new Date(),
    }).save();
    // eslint-disable-next-line no-underscore-dangle
    const userMessageId = userMessage._id;
    const message = {
      _id: userMessageId,
      messageRoomId,
      userId: userDetails._id,
      userName: userDetails.name,
      userAvatar: userDetails.avatar,
      title: userMessage.title,
      text: userMessage.text,
      type,
      created: userMessage.created,
      mutation_type: MUTATION_CREATED,
    };
    await pubsub.publish('messageEvent', { message });
    return message;
  };
};
