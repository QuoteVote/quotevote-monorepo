import { ObjectId } from 'mongodb';
import MessageModel from '../models/MessageModel';
import UserModel from '../models/UserModel';
import PostModel from '../models/PostModel';
import { getUnreadMessages } from '~/resolvers/utils/message/getUnreadMessages';
import { getMessages } from '../utils/message/getMessages';

const resolveBuddyUser = async (users, contextUserId) => {
  if (!contextUserId || !Array.isArray(users) || users.length === 0) {
    return null;
  }

  const contextId = contextUserId.toString();
  const buddyId = users
    .map((userId) => userId.toString())
    .find((userId) => userId !== contextId) || contextId;

  try {
    const buddyUserId = new ObjectId(buddyId);
    const buddyUser = await UserModel.findById(buddyUserId);
    return buddyUser;
  } catch (err) {
    return null;
  }
};

export const messageRoomRelationship = () => {
  return {
    async title(data, root, context) {
      const { users, messageType, postId } = data;
      let title;
      if (messageType === 'USER') {
        const contextUserId = context.user._id;
        const user = await resolveBuddyUser(users, contextUserId);

        if (user) {
          title = user.name;
          if (!title) {
            title = user.username;
          }
        }

        if (!title) {
          title = 'Unknown User';
        }
      } else if (messageType === 'POST') {
        const postIdObject = new ObjectId(postId);
        const post = await PostModel.findById(postIdObject);
        if (post) {
          title = post.title;
        }
      }

      if (!title) {
        const messageRoomId = new ObjectId(data.messageRoomId);
        const message = await MessageModel.findOne({ messageRoomId });
        title = message.title;
      }
      return title;
    },
    async avatar(data, root, context) {
      const { users, messageType } = data;
      let avatar;
      if (messageType === 'USER') {
        const contextUserId = context.user._id;
        const user = await resolveBuddyUser(users, contextUserId);
        avatar = user ? user.avatar : avatar;
      }
      return avatar;
    },
    async messages(data, root, context) {
      const { _id: messageRoomId } = data;
      const messages = await getMessages(messageRoomId, context);
      return messages;
    },
    async unreadMessages(data, root, context) {
      const { _id: messageRoomId } = data;
      const unreadMessages = await getUnreadMessages(messageRoomId, context);
      return unreadMessages.length;
    },
    async buddy(data, root, context) {
      const { users, messageType } = data;
      if (messageType !== 'USER') {
        return null;
      }

      const contextUserId = context.user._id;
      const user = await resolveBuddyUser(users, contextUserId);
      return user;
    },
  };
};
