import mongoose from 'mongoose';
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import ChatConversationModel from '~/resolvers/models/ChatConversationModel';
import ChatMessageModel from '~/resolvers/models/ChatMessageModel';
import ChatPresenceModel from '~/resolvers/models/ChatPresenceModel';
import ChatReceiptModel from '~/resolvers/models/ChatReceiptModel';
import ChatRosterModel from '~/resolvers/models/ChatRosterModel';
import { pubsub } from '~/resolvers/subscriptions';
import {
  assertNotBlocked,
  guardRateLimit,
  isMutualBuddy,
  upsertRoster,
} from '~/resolvers/utils/chat';

const PRESENCE_TTL_MS = 2 * 60 * 1000;

const buildPresencePayload = (presence, roster) => {
  const allowedUserIds = new Set();
  allowedUserIds.add(presence.userId.toString());
  (roster?.buddies || []).forEach((buddyId) => allowedUserIds.add(buddyId.toString()));

  return {
    ...presence,
    allowedUserIds: Array.from(allowedUserIds),
  };
};

const emitPresence = async (presenceDoc) => {
  const roster = await ChatRosterModel.findOne({ userId: presenceDoc.userId }).lean();
  const payload = buildPresencePayload(presenceDoc, roster);
  pubsub.publish('presenceUpdatedEvent', { presenceUpdated: payload });
};

const requireUser = (context) => {
  const { user } = context;
  if (!user || !user._id) {
    throw new AuthenticationError('Authentication required');
  }
  return mongoose.Types.ObjectId(user._id);
};

const mapConversationMembers = (conversation) =>
  (conversation.memberIds || []).map((id) => id.toString());

export const heartbeat = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);

    const { state = 'online', statusText = null } = args || {};

    const now = new Date();
    const expiresAt = new Date(Date.now() + PRESENCE_TTL_MS);

    const presenceDoc = await ChatPresenceModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          state,
          statusText,
          updatedAt: now,
          expiresAt,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    await ChatRosterModel.updateOne(
      { userId },
      { $set: { statusText } },
      { upsert: true },
    );

    await emitPresence(presenceDoc);

    return presenceDoc;
  };
};

export const setStatus = () => {
  return async (_, args, context) => {
    const statusText = args?.statusText || null;
    const state = statusText ? 'away' : 'online';
    return heartbeat()(_, { state, statusText }, context);
  };
};

export const requestBuddy = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const targetId = mongoose.Types.ObjectId(args.userId);

    if (userId.toString() === targetId.toString()) {
      throw new UserInputError('Cannot request yourself');
    }

    await assertNotBlocked(userId, targetId);

    await upsertRoster(userId);
    await upsertRoster(targetId);

    await ChatRosterModel.updateOne(
      { userId },
      { $addToSet: { requestsOut: targetId } },
      { upsert: true },
    );
    await ChatRosterModel.updateOne(
      { userId: targetId },
      { $addToSet: { requestsIn: userId } },
      { upsert: true },
    );

    return true;
  };
};

export const acceptBuddy = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const targetId = mongoose.Types.ObjectId(args.userId);

    await upsertRoster(userId);
    await upsertRoster(targetId);

    await ChatRosterModel.updateOne(
      { userId },
      {
        $pull: { requestsIn: targetId },
        $addToSet: { buddies: targetId },
      },
      { upsert: true },
    );

    await ChatRosterModel.updateOne(
      { userId: targetId },
      {
        $pull: { requestsOut: userId },
        $addToSet: { buddies: userId },
      },
      { upsert: true },
    );

    return true;
  };
};

export const blockUser = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const targetId = mongoose.Types.ObjectId(args.userId);

    await upsertRoster(userId);
    await ChatRosterModel.updateOne(
      { userId },
      {
        $addToSet: { blocked: targetId },
        $pull: {
          buddies: targetId,
          requestsIn: targetId,
          requestsOut: targetId,
        },
      },
      { upsert: true },
    );

    await ChatRosterModel.updateOne(
      { userId: targetId },
      {
        $pull: {
          buddies: userId,
          requestsIn: userId,
          requestsOut: userId,
        },
      },
    );

    return true;
  };
};

export const unblockUser = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const targetId = mongoose.Types.ObjectId(args.userId);

    await ChatRosterModel.updateOne(
      { userId },
      { $pull: { blocked: targetId } },
    );

    return true;
  };
};

export const ensureDirect = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const withUserId = mongoose.Types.ObjectId(args.withUserId);

    if (!(await isMutualBuddy(userId, withUserId))) {
      throw new ForbiddenError('Mutual opt-in required');
    }

    await assertNotBlocked(userId, withUserId);

    const existing = await ChatConversationModel.findOne({
      type: 'dm',
      memberIds: { $all: [userId, withUserId], $size: 2 },
    }).lean();

    if (existing) {
      return existing;
    }

    const created = await ChatConversationModel.create({
      type: 'dm',
      memberIds: [userId, withUserId],
      createdBy: userId,
      createdAt: new Date(),
    });

    return created.toObject();
  };
};

export const createChatRoom = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const { input } = args;

    const postId = mongoose.Types.ObjectId(input.postId);
    const memberIds = Array.from(new Set([
      userId.toString(),
      ...(input.memberIds || []).map((id) => id.toString()),
    ])).map((id) => mongoose.Types.ObjectId(id));

    const existing = await ChatConversationModel.findOne({ type: 'room', postId }).lean();
    if (existing) {
      await ChatConversationModel.updateOne(
        { _id: existing._id },
        { $addToSet: { memberIds: { $each: memberIds } } },
      );
      return ChatConversationModel.findById(existing._id).lean();
    }

    const created = await ChatConversationModel.create({
      type: 'room',
      memberIds,
      postId,
      createdBy: userId,
      createdAt: new Date(),
    });

    return created.toObject();
  };
};

export const sendChatMessage = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const { conversationId, body } = args;

    if (!body || !body.trim()) {
      throw new UserInputError('Message body cannot be empty');
    }

    guardRateLimit(userId.toString());

    const convoId = mongoose.Types.ObjectId(conversationId);
    const conversation = await ChatConversationModel.findById(convoId);

    if (!conversation || !conversation.memberIds.some((id) => id.toString() === userId.toString())) {
      throw new ForbiddenError('Conversation not found or access denied');
    }

    const memberIds = conversation.memberIds || [];
    // Ensure there are no blocks between participants
    // eslint-disable-next-line no-restricted-syntax
    for (const memberId of memberIds) {
      if (memberId.toString() !== userId.toString()) {
        // eslint-disable-next-line no-await-in-loop
        await assertNotBlocked(userId, memberId);
      }
    }

    const message = await ChatMessageModel.create({
      conversationId: convoId,
      senderId: userId,
      body: body.trim(),
      createdAt: new Date(),
    });

    conversation.lastMsgAt = message.createdAt;
    await conversation.save();

    const payload = {
      ...message.toObject(),
      allowedUserIds: mapConversationMembers(conversation),
    };

    pubsub.publish('messageAddedEvent', {
      messageAdded: payload,
    });

    return payload;
  };
};

export const setTyping = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const { conversationId, isTyping } = args;

    const convoId = mongoose.Types.ObjectId(conversationId);
    const conversation = await ChatConversationModel.findById(convoId).lean();

    if (!conversation || !conversation.memberIds.some((id) => id.toString() === userId.toString())) {
      throw new ForbiddenError('Conversation not found or access denied');
    }

    const until = new Date(Date.now() + 5000);
    pubsub.publish('typingUpdatedEvent', {
      typingUpdated: {
        conversationId: convoId,
        userId,
        isTyping,
        until,
        allowedUserIds: mapConversationMembers(conversation),
      },
    });

    return true;
  };
};

export const markChatRead = () => {
  return async (_, args, context) => {
    const userId = requireUser(context);
    const { conversationId, lastSeenMessageId } = args;

    const convoId = mongoose.Types.ObjectId(conversationId);
    const conversation = await ChatConversationModel.findById(convoId).lean();

    if (!conversation || !conversation.memberIds.some((id) => id.toString() === userId.toString())) {
      throw new ForbiddenError('Conversation not found or access denied');
    }

    const receipt = await ChatReceiptModel.findOneAndUpdate(
      { conversationId: convoId, userId },
      {
        $set: {
          lastSeenMessageId: mongoose.Types.ObjectId(lastSeenMessageId),
          lastSeenAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const payload = {
      ...receipt.toObject(),
      allowedUserIds: mapConversationMembers(conversation),
    };

    pubsub.publish('receiptUpdatedEvent', {
      receiptUpdated: payload,
    });

    return payload;
  };
};
