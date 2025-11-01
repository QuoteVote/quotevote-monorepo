import UserInviteModel from '../../models/UserInviteModel';
import UserModel from '../../models/UserModel';

export const getUserInvites = () => {
  return async (_, args) => {
    const { userId, status } = args || {};

    try {
      // If userId is provided, return UserInvite records (invites sent by that user)
      if (userId) {
        const query = { _inviterId: userId };
        if (status) {
          query.status = status;
        }

        console.log('getUserInvites query (with userId):', query);
        const invites = await UserInviteModel.find(query)
          .populate('_inviterId', 'username name')
          .populate('_invitedUserId', 'username name')
          .sort({ createdAt: -1 });

        console.log('getUserInvites found invites:', invites?.length || 0);
        return invites || [];
      }

      // If no userId, return prospect users (status 1) converted to UserInvite format
      // This is for the userInviteRequests query used in admin panel
      console.log('getUserInvites: fetching prospect users (status 1)');
      const prospectUsers = await UserModel.find({ status: 1 })
        .sort({ createdAt: -1 });

      console.log('getUserInvites found prospect users:', prospectUsers?.length || 0);

      // Convert prospect users to UserInvite format
      const invites = prospectUsers.map((user) => ({
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id.toString(),
        email: user.email,
        status: '1', // Map status 1 to string '1' for frontend compatibility
        joined: user.joined || null,
        createdAt: user.createdAt || user.joined || new Date(),
      }));

      return invites || [];
    } catch (error) {
      console.error('Error getting user invites:', error);
      throw new Error('Failed to get user invites');
    }
  };
};
