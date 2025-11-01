import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import localForage from 'localforage'

import userReducer from 'store/user'
import uiReducer, { uiInitialState } from 'store/ui'
import chatReducer from 'store/chat'
import filterReducer from 'store/filter'
import locationReducer from 'store/location'

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  chat: chatReducer,
  filter: filterReducer,
  location: locationReducer,
})

const persistConfig = {
  key: 'root',
  storage: localForage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// To add middleware the end of the array
const middleware = [
  ...getDefaultMiddleware({ serializableCheck: false }),
]

const preloadedState = {
  ui: uiInitialState,
}

const store = configureStore({
  reducer: persistedReducer,
  middleware,
  preloadedState,
  devTools: process.env.NODE_ENV === 'development',
})

const testPreloadState = {
  ui: uiInitialState,
  user: {
    loading: false,
    loginError: null,
    data: { admin: true },
  },
}

export const testStore = configureStore({
  reducer: persistedReducer,
  middleware,
  preloadedState: testPreloadState,
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

export default store
