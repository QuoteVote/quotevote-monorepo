import MessageRoomModel from '../../models/MessageRoomModel';

export const getPostChatRoom = () => {
  return async (_, args) => {
    const { postId } = args;
    const postMessageRoom = await MessageRoomModel.findOne({ postId });
    return postMessageRoom;
  };
};
