/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

export const uiInitialState = {
  filter: {
    visibility: false,
    value: '',
  },
  date: {
    visibility: false,
    value: '',
  },
  search: {
    visibility: false,
    value: '',
  },
  selectedPost: {
    id: null,
  },
  selectedPage: 'home',
  hiddenPosts: [],
  snackbar: {
    open: false,
    type: '',
    message: '',
  },
  selectedPlan: 'personal',
  focusedComment: null,
  sharedComment: null,
  showAnonymousVotes: true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: uiInitialState,
  reducers: {
    SET_SELECTED_POST: (state, action) => {
      state.selectedPost.id = action.payload
    },
    SET_SELECTED_PAGE: (state, action) => {
      state.selectedPage = action.payload
    },
    SET_HIDDEN_POSTS: (state, action) => {
      state.hiddenPosts = [...state.hiddenPosts, action.payload]
    },
    SET_SNACKBAR: (state, action) => {
      state.snackbar = action.payload
    },
    SET_SELECTED_PLAN: (state, action) => {
      state.selectedPlan = action.payload
    },
    SET_FOCUSED_COMMENT: (state, action) => {
      state.focusedComment = action.payload
    },
    SET_SHARED_COMMENT: (state, action) => {
      state.sharedComment = action.payload
    },
    SET_SHOW_ANONYMOUS_VOTES: (state, action) => {
      state.showAnonymousVotes = action.payload
    },
  },
})

export const {
  SET_SELECTED_POST,
  SET_SELECTED_PAGE,
  SET_HIDDEN_POSTS,
  SET_SNACKBAR,
  SET_SELECTED_PLAN,
  SET_FOCUSED_COMMENT,
  SET_SHARED_COMMENT,
  SET_SHOW_ANONYMOUS_VOTES,
} = uiSlice.actions

export default uiSlice.reducer
