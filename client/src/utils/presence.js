import moment from 'moment'

const KNOWN_STATUSES = ['ONLINE', 'AWAY', 'OFFLINE']

export const normalizePresenceStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return 'OFFLINE'
  }

  const normalized = status.toUpperCase()
  if (KNOWN_STATUSES.includes(normalized)) {
    return normalized
  }

  return 'OFFLINE'
}

export const PRESENCE_LABELS = {
  ONLINE: 'Available',
  AWAY: 'Away',
  OFFLINE: 'Offline',
}

export const PRESENCE_COLORS = {
  ONLINE: '#4CAF50',
  AWAY: '#FF9800',
  OFFLINE: '#9E9E9E',
}

export const getPresenceLabel = (status) => {
  return PRESENCE_LABELS[normalizePresenceStatus(status)]
}

export const getPresenceColor = (status) => {
  return PRESENCE_COLORS[normalizePresenceStatus(status)]
}

export const presenceSortValue = (status) => {
  const normalized = normalizePresenceStatus(status)
  switch (normalized) {
    case 'ONLINE':
      return 0
    case 'AWAY':
      return 1
    default:
      return 2
  }
}

export const isAwayStatus = (status) => normalizePresenceStatus(status) === 'AWAY'

export const describePresence = (status, awayMessage, lastActiveAt) => {
  const normalized = normalizePresenceStatus(status)

  if (normalized === 'AWAY' && awayMessage) {
    return awayMessage
  }

  if (normalized === 'ONLINE') {
    return 'Available now'
  }

  if (lastActiveAt) {
    const momentDate = moment(lastActiveAt)
    if (momentDate.isValid()) {
      return `Last seen ${momentDate.fromNow()}`
    }
  }

  return 'Offline'
}
