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
      const { users, messageType, postId } = data;
      let avatar;
      
      if (messageType === 'USER') {
        // Direct message - return the other user's avatar
        if (context.user && context.user._id) {
          const contextUserId = context.user._id;
          const userBuddy = users.filter((user) => user.toString() !== contextUserId.toString());
          if (userBuddy && userBuddy.length > 0) {
            const buddyUserId = new ObjectId(userBuddy[0]);
            const user = await UserModel.findById(buddyUserId);
            if (user && user.avatar) {
              avatar = user.avatar;
            }
          }
        } else if (users && users.length > 0) {
          // If no context user, return first user's avatar
          const userId = new ObjectId(users[0]);
          const user = await UserModel.findById(userId);
          if (user && user.avatar) {
            avatar = user.avatar;
          }
        }
      } else if (messageType === 'POST' && postId) {
        // Group chat for post - return the post creator's avatar
        try {
          const postIdObject = new ObjectId(postId);
          const post = await PostModel.findById(postIdObject);
          if (post && post.userId) {
            const postCreator = await UserModel.findById(post.userId);
            if (postCreator && postCreator.avatar) {
              avatar = postCreator.avatar;
            }
          }
        } catch (error) {
          // If post not found, fall through to group chat logic
        }
      }
      
      // For other group chats or if avatar not found above, return first user's avatar (excluding current user)
      if (!avatar && users && users.length > 0) {
        try {
          const contextUserId = context.user?._id;
          // Get first user that's not the current user, or first user if no context user
          const otherUser = users.find((user) => {
            if (!contextUserId) return true;
            return user.toString() !== contextUserId.toString();
          }) || users[0];
          
          if (otherUser) {
            const userId = new ObjectId(otherUser);
            const user = await UserModel.findById(userId);
            if (user && user.avatar) {
              avatar = user.avatar;
            }
          }
        } catch (error) {
          // If user not found, return null
        }
      }
      
      return avatar || null;
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
