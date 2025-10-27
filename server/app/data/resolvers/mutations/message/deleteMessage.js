import MessageModel from '../../models/MessageModel';

export const deleteMessage = () => {
  return async (_, args, context) => {
    const { messageId } = args;
    const { user } = context;
    
    if (!user) {
      throw new Error('Authentication required');
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      return { _id: messageId };
    }

    // Check if user is the message creator or an admin
    if (message.userId.toString() !== user._id.toString() && !user.admin) {
      throw new Error('Not authorized to delete this message');
    }

    // Soft delete by setting deleted flag to true
    await MessageModel.updateOne({ _id: messageId }, { $set: { deleted: true } });
    return { _id: messageId };
  };
}; 