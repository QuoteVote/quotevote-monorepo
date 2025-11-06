import { addUserToPostRoom } from '../../utils/message/addUserToPostRoom';

export const createPostMessageRoom = () => {
  return async (_, args, context) => {
    const userId = context.user._id;
    const { postId } = args;
    
    // Use the reusable helper function
    const messageRoom = await addUserToPostRoom(postId, userId);
    
    return messageRoom;
  };
};
