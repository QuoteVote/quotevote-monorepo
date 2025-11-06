export const Roster = `
  # Roster status enum
  enum RosterStatus {
    pending
    accepted
    blocked
  }

  # Roster entry (buddy relationship)
  type Roster {
    _id: String!
    userId: String!
    buddyId: String!
    status: RosterStatus!
    initiatedBy: String!
    buddy: User
    presence: Presence
    created: Date!
    updated: Date!
  }

  # Buddy with presence information
  type BuddyWithPresence {
    user: User!
    presence: Presence
    roster: Roster!
  }

  # Deleted roster response
  type DeletedRoster {
    _id: String!
    success: Boolean!
  }
`;

