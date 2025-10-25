import { ForbiddenError } from 'apollo-server-express';
import ChatRosterModel from '~/resolvers/models/ChatRosterModel';

const RATE_MAX_PER_30S = 6;
const RATE_WINDOW_MS = 30 * 1000;

const userMessageWindow = new Map();

export const guardRateLimit = (userId) => {
  const now = Date.now();
  const existing = userMessageWindow.get(userId) || [];
  const trimmed = existing.filter((timestamp) => now - timestamp < RATE_WINDOW_MS);

  if (trimmed.length >= RATE_MAX_PER_30S) {
    throw new ForbiddenError('Rate limit exceeded. Please slow down.');
  }

  trimmed.push(now);
  userMessageWindow.set(userId, trimmed);
};

export const assertNotBlocked = async (userId, otherUserId) => {
  const [myRoster, theirRoster] = await Promise.all([
    ChatRosterModel.findOne({ userId }).lean(),
    ChatRosterModel.findOne({ userId: otherUserId }).lean(),
  ]);

  const iBlocked = myRoster?.blocked?.some((id) => id.toString() === otherUserId.toString());
  const theyBlocked = theirRoster?.blocked?.some((id) => id.toString() === userId.toString());

  if (iBlocked || theyBlocked) {
    throw new ForbiddenError('Messaging is blocked between these users.');
  }
};

export const isMutualBuddy = async (userId, otherUserId) => {
  const [myRoster, theirRoster] = await Promise.all([
    ChatRosterModel.findOne({ userId }).lean(),
    ChatRosterModel.findOne({ userId: otherUserId }).lean(),
  ]);

  const iHave = myRoster?.buddies?.some((id) => id.toString() === otherUserId.toString());
  const theyHave = theirRoster?.buddies?.some((id) => id.toString() === userId.toString());

  return Boolean(iHave && theyHave);
};

export const upsertRoster = async (userId) => {
  const roster = await ChatRosterModel.findOne({ userId });
  if (roster) {
    return roster;
  }
  const created = new ChatRosterModel({ userId });
  await created.save();
  return created;
};
