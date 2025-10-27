import * as activityQuery from './queries/activity';
import * as postQuery from './queries/post';
import * as groupQuery from './queries/group';
import * as messageQuery from './queries/message';
import * as userQuery from './queries/user';
import * as notificationQuery from './queries/notification';
import * as presenceQuery from './queries/presence';
import * as rosterQuery from './queries/roster';
import * as blocklistQuery from './queries/blocklist';
import * as typingQuery from './queries/typing';

export const resolver_query = function () {
  return {
    activities: activityQuery.getUserActivities(),
    post: postQuery.getPost(),
    posts: postQuery.topPosts(),
    featuredPosts: postQuery.getFeaturedPosts(),
    postMessageRoom: postQuery.getPostChatRoom(),
    userInviteRequests: userQuery.getUserInvites(),
    users: userQuery.getUsers(),
    user: userQuery.findUserById(),
    searchUser: userQuery.searchUser(),
    getUserFollowInfo: userQuery.getUserFollowInfo(),
    verifyUserPasswordResetToken: userQuery.verifyUserPasswordResetToken(),
    checkDuplicateEmail: userQuery.findUserByEmail(),
    getUserReputation: userQuery.getUserReputation(),
    getUserInvites: userQuery.getUserInvites(),
    getUserReports: userQuery.getUserReports(),
    groups: groupQuery.getGroups(),
    group: groupQuery.getGroupById(),
    actionReactions: postQuery.getActionReactions(),

    // Messages
    messages: messageQuery.getUserMessages(),
    messageRooms: messageQuery.getUserChatRooms(),
    messageRoom: messageQuery.getUserChatRoom(),
    notifications: notificationQuery.getNotifications(),
    messageReactions: messageQuery.getUserMessageReactions(),

    // Presence queries
    getUserPresence: presenceQuery.getUserPresence(),
    getBuddyListPresence: presenceQuery.getBuddyListPresence(),

    // Roster queries
    getUserRoster: rosterQuery.getUserRoster(),
    getPendingRosterRequests: rosterQuery.getPendingRosterRequests(),

    // Blocklist queries
    getUserBlocklist: blocklistQuery.getUserBlocklist(),
    isUserBlocked: blocklistQuery.isUserBlocked(),

    // Typing indicator queries
    getTypingIndicators: typingQuery.getTypingIndicators(),
  };
};
