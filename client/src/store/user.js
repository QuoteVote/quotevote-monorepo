/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    loginError: null,
    data: {},
  },
  reducers: {
    USER_LOGIN_REQUEST: (state) => {
      state.loading = true
    },
    USER_LOGIN_SUCCESS: (state, action) => {
      const { data, loading, loginError } = action.payload
      state.data = data
      state.loading = loading
      state.loginError = loginError
    },
    USER_LOGIN_FAILURE: (state, action) => {
      const { loginError, loading } = action.payload
      state.loading = loading
      state.loginError = loginError
    },
    USER_LOGOUT: (state) => {
      state.loading = false
      state.isLoggedIn = false
      state.data = {}
    },
    USER_TOKEN_VALIDATION: (state) => {
      state.loading = true
    },
    USER_TOKEN_VALIDATED: (state) => {
      state.loading = false
    },
    USER_UPDATE_AVATAR: (state, action) => {
      state.data.avatar = action.payload
    },
    SET_USER_DATA: (state, action) => {
      state.data = action.payload
    },
    UPDATE_FOLLOWING: (state, action) => {
      state.data._followingId =
        action.payload /* eslint-disable-line no-underscore-dangle */
    },
  },
})

// Do not export the actions.
// Create functions, then export them
const { actions } = userSlice

// Private function(s) for actions
const getToken = async (username, password) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_SERVER}/login`,
      {
        username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (err) {
    return { error: err }
  }
}

// Public functions that dispatch multiple actions
export const userLogin = async (
  username,
  password,
  dispatch,
  history,
  redirectPath = null,
) => {
  dispatch(actions.USER_LOGIN_REQUEST())
  dispatch(actions.USER_LOGIN_FAILURE({ loginError: null, loading: true }))
  const result = await getToken(username, password)
  if ('error' in result) {
    const serverConnectionRefuseError = {
      data: { message: 'Connection refuse' },
    }
    const errorMessage =
      typeof result.error.response !== 'undefined'
        ? result.error.response.data.message
        : serverConnectionRefuseError
    dispatch(
      actions.USER_LOGIN_FAILURE({ loginError: errorMessage, loading: false }),
    )
  } else {
    const { token, user } = result.data
    localStorage.setItem('token', token)
    dispatch(
      actions.USER_LOGIN_SUCCESS({
        data: user,
        loading: false,
        loginError: null,
      }),
    )
    // Validate and redirect to prevent open redirect vulnerabilities
    // Only allow relative paths starting with /
    let targetPath = '/search'
    if (redirectPath && typeof redirectPath === 'string') {
      // Check if it's a relative path starting with /
      if (redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
        targetPath = redirectPath
      }
    }
    history.push(targetPath)
  }
}

export function tokenValidator(dispatch) {
  dispatch(actions.USER_TOKEN_VALIDATION())
  const storedToken = localStorage.getItem('token')

  if (!storedToken) {
    dispatch(actions.USER_LOGOUT())
    return false
  }

  try {
    const decoded = jwtDecode(storedToken)
    const currentTime = Date.now() / 1000

    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token')
      dispatch(actions.USER_LOGOUT())
      return false
    }

    dispatch(actions.USER_TOKEN_VALIDATED())
    return true
  } catch (err) {
    // If token is invalid or can't be decoded
    localStorage.removeItem('token')
    dispatch(actions.USER_LOGOUT())
    return false
  }
}

export function clearToken(dispatch) {
  dispatch(actions.USER_LOGOUT())
  localStorage.removeItem('token')
}

export function updateAvatar(dispatch, avatar) {
  dispatch(actions.USER_UPDATE_AVATAR(avatar))
}

export function updateFollowing(dispatch, following) {
  dispatch(actions.UPDATE_FOLLOWING(following))
}

export const {
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  SET_USER_DATA,
  USER_TOKEN_VALIDATED,
  USER_TOKEN_VALIDATION,
  USER_UPDATE_AVATAR,
  UPDATE_FOLLOWING,
} = userSlice.actions

export default userSlice.reducer
