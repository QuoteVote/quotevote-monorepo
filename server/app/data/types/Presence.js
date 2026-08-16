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
    # The status the user last chose for themselves. Kept separate from status
    # so the stale-presence cleanup marking someone offline does not erase
    # their intent — the next heartbeat restores them to this.
    preferredStatus: PresenceStatus
    preferredStatusMessage: String
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
  #
  # Returns the caller's presence after the beat so a client that has just
  # reloaded can restore status without a second round trip.
  type HeartbeatResponse {
    success: Boolean!
    timestamp: Date!
    status: PresenceStatus
    statusMessage: String
  }
`;

