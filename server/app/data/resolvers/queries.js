import * as activityQuery from './queries/activity';
import * as postQuery from './queries/post';
import * as groupQuery from './queries/group';
import * as messageQuery from './queries/message';
import * as userQuery from './queries/user';
import * as notificationQuery from './queries/notification';
import * as chatQuery from './queries/chat';

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
    groups: groupQuery.getGroups(),
    group: groupQuery.getGroupById(),
    actionReactions: postQuery.getActionReactions(),

    // Messages
    messages: messageQuery.getUserMessages(),
    messageRooms: messageQuery.getUserChatRooms(),
    messageRoom: messageQuery.getUserChatRoom(),
    notifications: notificationQuery.getNotifications(),
    messageReactions: messageQuery.getUserMessageReactions(),

    // Presence-aware chat
    myBuddyList: chatQuery.getMyBuddyList(),
    myConversations: chatQuery.getMyConversations(),
    chatMessages: chatQuery.getChatMessages(),
    chatReceipts: chatQuery.getChatReceipts(),
    searchChatMessages: chatQuery.searchChatMessages(),
  };
};
