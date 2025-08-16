/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'filter',
  initialState: {
    filter: {
      visibility: false,
      value: ['POSTED', 'VOTED', 'COMMENTED', 'QUOTED', 'LIKED'],
    },
    date: {
      visibility: false,
      value: '',
    },
    search: {
      visibility: false,
      value: '',
    },
  },
  reducers: {
    FILTER_VISIBILITY: (state, action) => {
      state.filter.visibility = action.payload
    },
    FILTER_VALUE: (state, action) => {
      state.filter.value = action.payload
    },
    DATE_VISIBILITY: (state, action) => {
      state.date.visibility = action.payload
    },
    DATE_VALUE: (state, action) => {
      state.date.value = action.payload
    },
    SEARCH_VISIBILITY: (state, action) => {
      state.search.visibility = action.payload
    },
    SEARCH_VALUE: (state, action) => {
      state.search.value = action.payload
    },
  },
})

export const {
  FILTER_VISIBILITY,
  FILTER_VALUE,
  DATE_VISIBILITY,
  DATE_VALUE,
  SEARCH_VISIBILITY,
  SEARCH_VALUE,
} = uiSlice.actions

export default uiSlice.reducer
