export const Presence = `
enum PresenceState {
  online
  away
  dnd
  invisible
}

type Presence {
  _id: ID
  userId: ObjectId!
  state: PresenceState!
  statusText: String
  updatedAt: Date
}
`;
