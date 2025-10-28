import { gql } from '@apollo/client';

export const GET_ONLINE_USERS = gql`
  query GetOnlineUsers {
    presenceOnlineUsers {
      userId
      status
      text
      lastSeen
    }
  }
`;

export const GET_USER_PRESENCE = gql`
  query GetUserPresence($userId: String!) {
    presence(userId: $userId) {
      userId
      status
      text
      lastSeen
    }
  }
`;

export const SET_PRESENCE = gql`
  mutation SetPresence($status: String!, $text: String) {
    presenceSet(status: $status, text: $text) {
      userId
      status
      text
      lastSeen
    }
  }
`;

export const PRESENCE_STREAM_SUBSCRIPTION = gql`
  subscription OnPresenceUpdate($userIds: [ID!]) {
    presenceStream(userIds: $userIds) {
      userId
      status
      text
      lastSeen
    }
  }
`;

export const PRESENCE_UPDATES_SUBSCRIPTION = gql`
  subscription OnPresenceUpdates {
    presenceUpdates {
      userId
      status
      text
      lastSeen
    }
  }
`;
