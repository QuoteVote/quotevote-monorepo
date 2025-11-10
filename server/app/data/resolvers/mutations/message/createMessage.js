import { UserInputError } from 'apollo-server-express';
import UserModel from '../../models/UserModel';
import PostModel from '../../models/PostModel';
import MessageModel from '~/resolvers/models/MessageModel';
import { createUserMessageRoom } from '~/resolvers/mutations/message/createUserMessageRoom';
import { createPostMessageRoom } from '~/resolvers/mutations/message/createPostMessageRoom';
import { addUserToPostRoom } from '~/resolvers/utils/message/addUserToPostRoom';
import { pubsub } from '~/resolvers/subscriptions';
import { MUTATION_CREATED } from '~/resolvers/constants/common';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import TypingModel from '~/resolvers/models/TypingModel';
import RosterModel from '~/resolvers/models/RosterModel';
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

    // Check if messageRoomId is valid (not null, undefined, or empty string)
    const hasValidRoomId = messageRoomId && messageRoomId.toString().trim() !== '';

    if (!hasValidRoomId) {
      // No room ID provided, create a new room
      if (type === 'USER') {
        messageRoom = await createUserMessageRoom(args, context);
      } else if (type === 'POST') {
        messageRoom = await createPostMessageRoom()(_, { postId: componentId }, context);
      }
    } else {
      // Room ID provided, try to find existing room
      messageRoom = await MessageRoomModel.findById(messageRoomId);
      
      if (!messageRoom) {
        // Room doesn't exist, create it based on type
        if (type === 'POST') {
          // Try to get postId from componentId, or find post by messageRoomId
          let postId = componentId;
          
          if (!postId && messageRoomId) {
            // Try to find post that has this messageRoomId
            const post = await PostModel.findOne({ messageRoomId });
            if (post) {
              postId = post._id;
            }
          }
          
          if (postId) {
            // Create POST room if it doesn't exist
            messageRoom = await addUserToPostRoom(postId, user._id);
            console.log(`Created post message room for post ${postId} and user ${user._id}`);
          } else {
            throw new UserInputError('Cannot create POST message room: post ID not found', {
              invalidArgs: Object.keys(args),
            });
          }
        } else if (type === 'USER') {
          // Create USER room if it doesn't exist
          messageRoom = await createUserMessageRoom(args, context);
        } else {
          throw new UserInputError('Message room not found and cannot be created', {
            invalidArgs: Object.keys(args),
          });
        }
      } else {
        // Room exists, ensure user is added for POST type rooms
        if (messageRoom.messageType === 'POST' && messageRoom.postId) {
          const usersStringArray = messageRoom.users.map((u) => u.toString());
          const userIdString = user._id.toString();
          
          if (!usersStringArray.includes(userIdString)) {
            // User is not in the room, add them
            try {
              messageRoom = await addUserToPostRoom(messageRoom.postId, user._id);
              console.log(`Added user ${user._id} to post ${messageRoom.postId} message room`);
            } catch (roomError) {
              console.error(`Error adding user to post message room: ${roomError.message}`);
              // Continue anyway - the message can still be sent
            }
          }
        }
        
        // For existing USER type rooms (DMs), check for blocking and mutual acceptance
        if (messageRoom.messageType === 'USER' && messageRoom.users?.length === 2) {
          const otherUserId = messageRoom.users.find((id) => id.toString() !== user._id.toString());
          
          if (otherUserId) {
            // Check if either user has blocked the other
            const blocked = await RosterModel.findOne({
              $or: [
                { userId: user._id, buddyId: otherUserId, status: 'blocked' },
                { userId: otherUserId, buddyId: user._id, status: 'blocked' },
              ],
            });

            if (blocked) {
              throw new UserInputError('Cannot send message: user is blocked', {
                invalidArgs: Object.keys(args),
              });
            }
          }
        }
      }
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
