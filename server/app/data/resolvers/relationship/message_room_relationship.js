import { ObjectId } from 'mongodb';
import MessageModel from '../models/MessageModel';
import UserModel from '../models/UserModel';
import PostModel from '../models/PostModel';
import { getUnreadMessages } from '~/resolvers/utils/message/getUnreadMessages';
import { getMessages } from '../utils/message/getMessages';

export const messageRoomRelationship = () => {
  return {
    async title(data, root, context) {
      const { users, messageType, postId } = data;
      let title;
      if (messageType === 'USER') {
        const contextUserId = context.user._id;

        const userBuddy = users.filter((user) => user.toString() !== contextUserId.toString());

        if (userBuddy) {
          if (userBuddy.length === 0) {
            userBuddy.push(contextUserId);
          }
          const buddyUserId = new ObjectId(userBuddy[0]);
          const user = await UserModel.findById(buddyUserId);
          title = user.name;
          if (!title) {
            title = user.username;
          }
          if (!title) {
            title = 'Unknown User';
          }
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
        const userBuddy = users.filter((user) => user.toString() !== contextUserId.toString());
        if (userBuddy) {
          if (userBuddy.length === 0) {
            userBuddy.push(contextUserId);
          }
          const buddyUserId = new ObjectId(userBuddy[0]);
          const user = await UserModel.findById(buddyUserId);
          avatar = user.avatar;
        }
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
  };
};
