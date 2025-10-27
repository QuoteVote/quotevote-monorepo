import UserInviteModel from '../../models/UserInviteModel';

export const getUserInvites = () => {
  return async (_, args) => {
    const { userId, status } = args;
    
    try {
      const query = { _inviterId: userId };
      if (status) {
        query.status = status;
      }
      
      const invites = await UserInviteModel.find(query)
        .populate('_inviterId', 'username name')
        .populate('_invitedUserId', 'username name')
        .sort({ createdAt: -1 });
      
      return invites;
    } catch (error) {
      console.error('Error getting user invites:', error);
      throw new Error('Failed to get user invites');
    }
  };
};