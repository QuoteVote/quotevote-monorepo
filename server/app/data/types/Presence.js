export const Presence = `
  # Presence status enum
  enum PresenceStatus {
    online
    away
    dnd
    invisible
    offline
  }

  # User presence type
  type Presence {
    _id: String!
    userId: String!
    status: PresenceStatus!
    statusMessage: String
    lastHeartbeat: Date!
    lastSeen: Date
    user: User
  }

  # Presence update for subscriptions
  type PresenceUpdate {
    userId: String!
    status: PresenceStatus!
    statusMessage: String
    lastSeen: Date
  }

  # Heartbeat response
  type HeartbeatResponse {
    success: Boolean!
    timestamp: Date!
  }
`;

