import RosterModel from '../models/RosterModel';
import UserModel from '../models/UserModel';

/**
 * Add a user to the current user's roster
 */
export const addContact = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to add themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot add yourself to your roster');
    }

    // Check if user exists
    const userToAdd = await UserModel.findById(userId);
    if (!userToAdd) {
      throw new Error('User not found');
    }

    // Get or create the current user's roster
    let roster = await RosterModel.findOne({ userId: currentUserId });
    if (!roster) {
      roster = new RosterModel({ userId: currentUserId, contacts: [] });
    }

    // Check if user is already in roster
    const existingContactIndex = roster.contacts.findIndex(
      contact => contact.userId.toString() === userId.toString()
    );

    if (existingContactIndex >= 0) {
      // If already exists, update status to pending and update timestamp
      roster.contacts[existingContactIndex].status = 'pending';
      roster.contacts[existingContactIndex].updatedAt = new Date();
    } else {
      // Add new contact with pending status
      roster.contacts.push({
        userId: userId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Save the roster
    const savedRoster = await roster.save();

    return {
      success: true,
      message: 'Contact request sent',
    };
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

/**
 * Accept a contact request
 */
export const acceptContact = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to accept themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot accept yourself');
    }

    // Get the current user's roster
    let currentUserRoster = await RosterModel.findOne({ userId: currentUserId });
    if (!currentUserRoster) {
      currentUserRoster = new RosterModel({ userId: currentUserId, contacts: [] });
    }

    // Find the contact request
    const contactIndex = currentUserRoster.contacts.findIndex(
      contact => contact.userId.toString() === userId.toString()
    );

    if (contactIndex < 0) {
      throw new Error('Contact request not found');
    }

    // Update status to accepted
    currentUserRoster.contacts[contactIndex].status = 'accepted';
    currentUserRoster.contacts[contactIndex].updatedAt = new Date();

    // Save the current user's roster
    await currentUserRoster.save();

    // Also update the other user's roster to reflect mutual acceptance
    let otherUserRoster = await RosterModel.findOne({ userId: userId });
    if (!otherUserRoster) {
      otherUserRoster = new RosterModel({ userId: userId, contacts: [] });
    }

    // Find the contact entry for the current user in the other user's roster
    const otherContactIndex = otherUserRoster.contacts.findIndex(
      contact => contact.userId.toString() === currentUserId.toString()
    );

    if (otherContactIndex >= 0) {
      // If exists, update status to accepted
      otherUserRoster.contacts[otherContactIndex].status = 'accepted';
      otherUserRoster.contacts[otherContactIndex].updatedAt = new Date();
    } else {
      // If not exists, add as accepted contact
      otherUserRoster.contacts.push({
        userId: currentUserId,
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Save the other user's roster
    await otherUserRoster.save();

    return {
      success: true,
      message: 'Contact request accepted',
    };
  } catch (error) {
    console.error('Error accepting contact:', error);
    throw error;
  }
};

/**
 * Reject a contact request
 */
export const rejectContact = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to reject themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot reject yourself');
    }

    // Get the current user's roster
    const roster = await RosterModel.findOne({ userId: currentUserId });
    if (!roster) {
      throw new Error('No roster found');
    }

    // Find the contact request
    const contactIndex = roster.contacts.findIndex(
      contact => contact.userId.toString() === userId.toString()
    );

    if (contactIndex < 0) {
      throw new Error('Contact request not found');
    }

    // Update status to rejected
    roster.contacts[contactIndex].status = 'rejected';
    roster.contacts[contactIndex].updatedAt = new Date();

    // Save the roster
    await roster.save();

    return {
      success: true,
      message: 'Contact request rejected',
    };
  } catch (error) {
    console.error('Error rejecting contact:', error);
    throw error;
  }
};

/**
 * Remove a contact from roster
 */
export const removeContact = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to remove themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot remove yourself');
    }

    // Get the current user's roster
    const roster = await RosterModel.findOne({ userId: currentUserId });
    if (!roster) {
      throw new Error('No roster found');
    }

    // Remove the contact
    roster.contacts = roster.contacts.filter(
      contact => contact.userId.toString() !== userId.toString()
    );

    // Save the roster
    await roster.save();

    return {
      success: true,
      message: 'Contact removed',
    };
  } catch (error) {
    console.error('Error removing contact:', error);
    throw error;
  }
};

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

/**
 * Block a user
 */
export const blockUser = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Don't allow user to block themselves
    if (currentUserId.toString() === userId.toString()) {
      throw new Error('Cannot block yourself');
    }

    // Get the current user's roster
    let roster = await RosterModel.findOne({ userId: currentUserId });
    if (!roster) {
      roster = new RosterModel({ userId: currentUserId, contacts: [] });
    }

    // Find the contact
    const contactIndex = roster.contacts.findIndex(
      contact => contact.userId.toString() === userId.toString()
    );

    if (contactIndex >= 0) {
      // If exists, update status to blocked
      roster.contacts[contactIndex].status = 'blocked';
      roster.contacts[contactIndex].updatedAt = new Date();
    } else {
      // If not exists, add as blocked contact
      roster.contacts.push({
        userId: userId,
        status: 'blocked',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Save the roster
    await roster.save();

    return {
      success: true,
      message: 'User blocked',
    };
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

/**
 * Unblock a user
 */
export const unblockUser = () => async (root, { userId }, context) => {
  try {
    // Require authentication
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const currentUserId = context.user['_id'];

    // Get the current user's roster
    const roster = await RosterModel.findOne({ userId: currentUserId });
    if (!roster) {
      throw new Error('No roster found');
    }

    // Find the blocked contact
    const contactIndex = roster.contacts.findIndex(
      contact => contact.userId.toString() === userId.toString() && contact.status === 'blocked'
    );

    if (contactIndex < 0) {
      throw new Error('Blocked user not found');
    }

    // Remove the contact (unblock)
    roster.contacts.splice(contactIndex, 1);

    // Save the roster
    await roster.save();

    return {
      success: true,
      message: 'User unblocked',
    };
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};