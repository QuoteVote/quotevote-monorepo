/**
 * Location Redux Store
 * Manages user's current location and permission state
 */

import { createSlice } from '@reduxjs/toolkit';
import { getCurrentPosition, checkPermission, GeoLocationError } from '../utils/geolocationService';

const initialState = {
  currentLocation: null, // { lat, lng }
  permissionState: 'prompt', // 'prompt' | 'granted' | 'denied' | 'unsupported'
  isLoading: false,
  error: null, // { type, message }
  lastUpdated: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setPermissionState: (state, action) => {
      state.permissionState = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      state.lastUpdated = null;
      state.error = null;
    },
    reset: () => initialState,
  },
});

export const {
  setLocation,
  setPermissionState,
  setLoading,
  setError,
  clearError,
  clearLocation,
  reset,
} = locationSlice.actions;

// Thunks

/**
 * Fetch user's current location
 * @param {object} options - Options passed to getCurrentPosition
 */
export const fetchLocation = (options = {}) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    const location = await getCurrentPosition(options);
    dispatch(setLocation(location));
    dispatch(setPermissionState('granted'));
    return location;
  } catch (error) {
    dispatch(setError({
      type: error.type || GeoLocationError.UNKNOWN,
      message: error.message || 'Failed to get location',
    }));
    
    if (error.type === GeoLocationError.PERMISSION_DENIED) {
      dispatch(setPermissionState('denied'));
    }
    
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Check and update permission state
 */
export const updatePermissionState = () => async (dispatch) => {
  try {
    const state = await checkPermission();
    dispatch(setPermissionState(state));
    return state;
  } catch (error) {
    console.error('Failed to check permission:', error);
    return 'prompt';
  }
};

// Selectors

export const selectLocation = (state) => state.location.currentLocation;
export const selectPermissionState = (state) => state.location.permissionState;
export const selectIsLoading = (state) => state.location.isLoading;
export const selectError = (state) => state.location.error;
export const selectLastUpdated = (state) => state.location.lastUpdated;

export const selectHasLocation = (state) => state.location.currentLocation !== null;
export const selectIsPermissionGranted = (state) => state.location.permissionState === 'granted';
export const selectIsPermissionDenied = (state) => state.location.permissionState === 'denied';

export default locationSlice.reducer;
