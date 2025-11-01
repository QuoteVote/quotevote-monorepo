import * as postMutations from './mutations/post';
import * as groupMutations from './mutations/group';
import * as voteMutations from './mutations/vote';
import * as commentMutations from './mutations/comment';
import * as messageMutations from './mutations/message';
import * as stripeMutations from './mutations/stripe';
import * as userMutations from './mutations/user';
import * as userInviteMutations from './mutations/userInvite';
import * as quoteMutations from './mutations/quote';
import * as notificationMutations from './mutations/notification';
import * as presenceMutations from './mutations/presence';
import * as chatMutations from './mutations/chat';

// eslint-disable-next-line camelcase,import/prefer-default-export
export const resolver_mutations = function () {
  return {
    // Post
    addPost: postMutations.addPost(),
    approvePost: postMutations.approvePost(),
    rejectPost: postMutations.rejectPost(),
    updatePostBookmark: postMutations.updatePostBookmark(),
    updateFeaturedSlot: postMutations.updateFeaturedSlot(),
    addActionReaction: postMutations.addActionReactions(),
    updateActionReaction: postMutations.updateActionReaction(),
    reportPost: postMutations.reportPost(),
    deletePost: postMutations.deletePost(),
    toggleVoting: postMutations.toggleVoting(),
    setPresence: presenceMutations.setPresenceStatus(),
    presenceSet: presenceMutations.setPresenceForCurrentUser(),

    // Domain
    createGroup: groupMutations.createGroup(),

    // Votes mutations
    addVote: voteMutations.addVote(),
    deleteVote: voteMutations.deleteVote(),

    // Comment mutations
    addComment: commentMutations.addComment(),
    deleteComment: commentMutations.deleteComment(),

    // Quote mutation
    addQuote: quoteMutations.addQuote(),
    deleteQuote: quoteMutations.deleteQuote(),

    // Message mutations
    createMessage: messageMutations.createMessage(),
    createPostMessageRoom: messageMutations.createPostMessageRoom(),
    updateMessageReadBy: messageMutations.updateMessageReadBy(),
    addMessageReaction: messageMutations.addMessageReaction(),
    updateReaction: messageMutations.updateReaction(),
    deleteMessage: messageMutations.deleteMessage(),

    // Stripe mutations
    addStripeCustomer: stripeMutations.addStripeCustomer(),

    //  Follow post Mutations
    followUser: userMutations.followUser(),

    //  Follow request access mutations
    requestUserAccess: userInviteMutations.requestUserAccess(),
    sendInvestorMail: userInviteMutations.sendInvestorMail(),

    // User mutations
    sendPasswordResetEmail: userMutations.sendPasswordResetEmail(),
    updateUserPassword: userMutations.updateUserPassword(),
    updateUser: userMutations.updateUser(),

    // User invite
    sendUserInviteApproval: userInviteMutations.sendUserInviteApproval(),

    //  Avatar update
    updateUserAvatar: userMutations.updateUserAvatar(),

    //  Notifications
    removeNotification: notificationMutations.removeNotification(),

    // Reputation system mutations
    sendUserInvite: userMutations.sendUserInvite(),
    reportUser: userMutations.reportUser(),
    recalculateReputation: userMutations.recalculateReputation(),

    // Chat mutations
    convEnsureDirect: chatMutations.convEnsureDirect(),
    msgSend: chatMutations.msgSend(),
  };
};
