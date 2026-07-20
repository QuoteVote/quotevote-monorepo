export const getChatRoomNavigationPath = (room) => {
  if (!room) return null

  if (room.messageType === 'USER') {
    const username = room.otherUser?.username || room.user?.username
    return username ? `/Profile/${username}/` : null
  }

  if (room.messageType === 'POST') {
    return room.postDetails?.url || null
  }

  return null
}

export const getChatRoomNavigationLabel = (room, fallbackTitle = 'chat') => {
  if (room?.messageType === 'USER') {
    return `View profile for ${room.otherUser?.username || fallbackTitle}`
  }

  if (room?.messageType === 'POST') {
    return `View post ${fallbackTitle}`
  }

  return undefined
}
