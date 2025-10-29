import RosterModel from '../models/RosterModel';
import UserModel from '../models/UserModel';

/**
 * Get the current user's roster
 */
export const getRoster = () => async (root, args, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Get the current user's roster
    const roster = await RosterModel.findOne({ userId: currentUserId }).populate({
      path: 'contacts.userId',
      select: 'name username email avatar contributorBadge',
    });

    if (!roster) {
      return {
        userId: currentUserId,
        contacts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Transform contacts to match GraphQL schema
    const contacts = roster.contacts.map(contact => ({
      userId: contact.userId._id.toString(),
      status: contact.status,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      nickname: contact.nickname,
      user: {
        _id: contact.userId._id.toString(),
        name: contact.userId.name,
        username: contact.userId.username,
        email: contact.userId.email,
        avatar: contact.userId.avatar,
        contributorBadge: contact.userId.contributorBadge,
      },
    }));

    return {
      userId: roster.userId.toString(),
      contacts,
      createdAt: roster.createdAt.toISOString(),
      updatedAt: roster.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error getting roster:', error);
    throw error;
  }
};