import { nanoid } from 'nanoid';
import { logger } from '../../../utils/logger';
import { logActivity } from '../../utils/activities_utils';
import GroupModel from '../../models/GroupModel';
import PostModel from '../../models/PostModel';
import MessageRoomModel from '../../models/MessageRoomModel';

// Robust URL detection regex (handles http, https, www, ftp)
const URL_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;

// Regex to detect emojis
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/u;

// Strict allowlist: Only RFC 3986 compliant URL characters
const INVALID_URL_CHARS_REGEX = /[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/;

// Helper: Strict URL Sanitizer
const sanitizeUrl = (url) => {
  if (!url) return null;
  
  const trimmedUrl = url.trim();
  
  // Block emojis
  if (EMOJI_REGEX.test(trimmedUrl)) {
    return null;
  }
  
  // Block non-standard URL characters
  if (INVALID_URL_CHARS_REGEX.test(trimmedUrl)) {
    return null;
  }
  
  try {
    const parsed = new URL(trimmedUrl);
    
    // Block dangerous protocols
    if (!['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Ensure hostname exists
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return null;
    }
    
    return parsed.href;
  } catch (e) {
    return null;
  }
};

export const addPost = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: add post', { args });

    // Validation: Post body must NOT contain URLs
    URL_REGEX.lastIndex = 0;
    if (URL_REGEX.test(args.post.text)) {
      logger.warn('Post rejected: URL detected in body', { text: args.post.text });
      throw new Error('Post body cannot contain links. Please use the Citation field.');
    }

    // Validation: citationUrl (if provided) must pass strict sanitization
    let sanitizedCitationUrl = null;
    if (args.post.citationUrl) {
      sanitizedCitationUrl = sanitizeUrl(args.post.citationUrl);
      if (!sanitizedCitationUrl) {
        logger.warn('Post rejected: Invalid citationUrl (contains invalid characters, emojis, or malformed)', { citationUrl: args.post.citationUrl });
        throw new Error('Invalid citation URL. Only standard URL characters are allowed (no emojis or special characters).');
      }
    }

    let newPost = {};
    const group = await GroupModel.findById(args.post.groupId);
    const title = args.post.title.replace(/ /g, '-').toLowerCase();
    
    // Create the post first to get the ID
    const postObj = {
      ...args.post,
      url: '', // Temporary URL, will be updated after creation
      citationUrl: sanitizedCitationUrl,
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
