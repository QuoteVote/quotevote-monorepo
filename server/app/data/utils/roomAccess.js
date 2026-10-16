/**
 * Who may read a message room.
 *
 * Post discussion rooms are public, so logged-out visitors can read a post's
 * discussion. Every other room (direct messages) is readable only by the
 * users in it.
 */
export const canReadRoom = (room, user) => {
  if (!room) return false;
  if (room.messageType === 'POST') return true;
  // eslint-disable-next-line no-underscore-dangle
  if (!user || !user._id) return false;
  // eslint-disable-next-line no-underscore-dangle
  const userId = user._id.toString();
  return (room.users || []).some((id) => id && id.toString() === userId);
};

export default canReadRoom;
