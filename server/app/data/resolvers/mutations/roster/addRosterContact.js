import { UserInputError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import RosterModel from '../../models/RosterModel';
import UserModel from '../../models/UserModel';
import { pubsub } from '../../subscriptions';

export const addRosterContact = () => {
  return async (_, args, context) => {
    console.log('[MUTATION] addRosterContact');

    const { user } = context;
    if (!user) {
      throw new UserInputError('Authentication required');
    }

    const { contactUserId } = args.roster;

    // Validate contact user exists
    const contactUser = await UserModel.findById(contactUserId);
    if (!contactUser) {
      throw new UserInputError('Contact user not found');
    }

    // Can't add yourself
    if (user._id.toString() === contactUserId) {
      throw new UserInputError('Cannot add yourself as a contact');
    }

    // Check if roster entry already exists
    const existingRoster = await RosterModel.findOne({
      userId: user._id,
      contactUserId: new ObjectId(contactUserId),
    });

    if (existingRoster) {
      throw new UserInputError('Contact already in roster');
    }

    // Create roster entry for the initiating user
    const roster = await new RosterModel({
      userId: user._id,
      contactUserId: new ObjectId(contactUserId),
      status: 'pending',
      initiatedBy: user._id,
    }).save();

    // Create reciprocal roster entry for the contact
    await new RosterModel({
      userId: new ObjectId(contactUserId),
      contactUserId: user._id,
      status: 'pending',
      initiatedBy: user._id,
    }).save();

    // Publish roster update to contact user
    await pubsub.publish('rosterUpdate', {
      rosterUpdate: {
        _id: roster._id,
        userId: roster.userId.toString(),
        contactUserId: roster.contactUserId.toString(),
        status: roster.status,
        initiatedBy: roster.initiatedBy.toString(),
        createdAt: roster.createdAt,
        updatedAt: roster.updatedAt,
      },
    });

    return {
      _id: roster._id,
      userId: roster.userId.toString(),
      contactUserId: roster.contactUserId.toString(),
      status: roster.status,
      initiatedBy: roster.initiatedBy.toString(),
      createdAt: roster.createdAt,
      updatedAt: roster.updatedAt,
    };
  };
};
