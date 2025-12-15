import { nanoid } from 'nanoid';
import { logger } from '../../../utils/logger';
import { logActivity } from '../../utils/activities_utils';
import GroupModel from '../../models/GroupModel';
import PostModel from '../../models/PostModel';
import MessageRoomModel from '../../models/MessageRoomModel';

// Robust URL detection regex (handles http, https, www, ftp)
const URL_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

export const addPost = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: add post', { args });

    // Validation: Post body must NOT contain URLs
    if (URL_REGEX.test(args.post.text)) {
      logger.warn('Post rejected: URL detected in body', { text: args.post.text });
      throw new Error('Post body cannot contain links. Please use the Citation field.');
    }

    // Validation: citationUrl (if provided) must be a valid URL format
    if (args.post.citationUrl) {
      // Reset regex lastIndex for reuse
      URL_REGEX.lastIndex = 0;
      if (!URL_REGEX.test(args.post.citationUrl)) {
        logger.warn('Post rejected: Invalid citationUrl format', { citationUrl: args.post.citationUrl });
        throw new Error('Invalid citation URL format.');
      }
    }

    let newPost = {};
    const group = await GroupModel.findById(args.post.groupId);
    const title = args.post.title.replace(/ /g, '-').toLowerCase();
    
    // Create the post first to get the ID
    const postObj = {
      ...args.post,
      url: '', // Temporary URL, will be updated after creation
      citationUrl: args.post.citationUrl || null,
    };

    try {
      newPost = await new PostModel(postObj).save();
      
      // Now create the URL using the actual post ID
      const url = `/post${group.url}/${title}/${newPost._id}`;
      
      // Update the post with the correct URL
      await PostModel.findByIdAndUpdate(newPost._id, { url });
      newPost.url = url;

      const messageRoom = await MessageRoomModel.create({ users: newPost.userId, postId: newPost._id, messageType: 'POST' });

      const ids = {
        postId: newPost._id,
        userId: newPost.userId,
        messageRoomId: messageRoom._id,
      };
      newPost.messageRoomId = messageRoom._id;

      await logActivity('POSTED', ids, newPost.title);
    } catch (err) {
      throw new Error(err);
    }
    return newPost;
  };
};
