/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const chat = createSlice({
  name: 'chat',
  initialState: {
    submitting: false,
    selectedRoom: null,
    open: false,
    // Presence-aware features
    buddyList: [],
    presenceMap: {}, // { userId: { status, statusMessage, lastSeen } }
    typingUsers: {}, // { messageRoomId: [userId1, userId2] }
    userStatus: 'online',
    userStatusMessage: '',
    pendingBuddyRequests: [],
    blockedUsers: [],
    statusEditorOpen: false,
  },
  reducers: {
    CHAT_SUBMITTING: (state, action) => {
      state.submitting = action.payload
    },
    SELECTED_CHAT_ROOM: (state, action) => {
      state.selectedRoom = action.payload
    },
    SET_CHAT_OPEN: (state, action) => {
      state.open = action.payload
    },
    // New presence/roster reducers
    SET_BUDDY_LIST: (state, action) => {
      state.buddyList = action.payload
    },
    UPDATE_PRESENCE: (state, action) => {
      const { userId, status, statusMessage, lastSeen } = action.payload
      state.presenceMap[userId] = { status, statusMessage, lastSeen }
    },
    REMOVE_PRESENCE: (state, action) => {
      const { userId } = action.payload
      delete state.presenceMap[userId]
    },
    UPDATE_TYPING: (state, action) => {
      const { messageRoomId, userId, isTyping } = action.payload
      if (!state.typingUsers[messageRoomId]) {
        state.typingUsers[messageRoomId] = []
      }
      if (isTyping) {
        if (!state.typingUsers[messageRoomId].includes(userId)) {
          state.typingUsers[messageRoomId].push(userId)
        }
      } else {
        state.typingUsers[messageRoomId] = state.typingUsers[messageRoomId].filter(
          (id) => id !== userId
        )
      }
    },
    CLEAR_TYPING: (state, action) => {
      const { messageRoomId } = action.payload
      state.typingUsers[messageRoomId] = []
    },
    SET_USER_STATUS: (state, action) => {
      state.userStatus = action.payload.status
      state.userStatusMessage = action.payload.statusMessage || ''
    },
    SET_PENDING_REQUESTS: (state, action) => {
      state.pendingBuddyRequests = action.payload
    },
    ADD_PENDING_REQUEST: (state, action) => {
      state.pendingBuddyRequests.push(action.payload)
    },
    REMOVE_PENDING_REQUEST: (state, action) => {
      const rosterId = action.payload
      state.pendingBuddyRequests = state.pendingBuddyRequests.filter(
        (req) => req._id !== rosterId
      )
    },
    SET_BLOCKED_USERS: (state, action) => {
      state.blockedUsers = action.payload
    },
    ADD_BLOCKED_USER: (state, action) => {
      state.blockedUsers.push(action.payload)
    },
    REMOVE_BLOCKED_USER: (state, action) => {
      const userId = action.payload
      state.blockedUsers = state.blockedUsers.filter((id) => id !== userId)
    },
    SET_STATUS_EDITOR_OPEN: (state, action) => {
      state.statusEditorOpen = action.payload
    },
  },
})

export const {
  CHAT_SUBMITTING,
  SELECTED_CHAT_ROOM,
  SET_CHAT_OPEN,
  SET_BUDDY_LIST,
  UPDATE_PRESENCE,
  REMOVE_PRESENCE,
  UPDATE_TYPING,
  CLEAR_TYPING,
  SET_USER_STATUS,
  SET_PENDING_REQUESTS,
  ADD_PENDING_REQUEST,
  REMOVE_PENDING_REQUEST,
  SET_BLOCKED_USERS,
  ADD_BLOCKED_USER,
  REMOVE_BLOCKED_USER,
  SET_STATUS_EDITOR_OPEN,
} = chat.actions

export default chat.reducer
