import { configureStore } from '@reduxjs/toolkit';
import locationReducer, {
  fetchLocation,
  updatePermissionState,
  setLocation,
  setPermissionState,
  setLoading,
  setError,
  clearError,
  clearLocation,
  reset,
  selectLocation,
  selectPermissionState,
  selectIsLoading,
  selectError,
  selectHasLocation,
  selectIsPermissionGranted,
  selectIsPermissionDenied,
} from '../location';
import * as geolocationService from '../../utils/geolocationService';

// Mock geolocation service
jest.mock('../../utils/geolocationService');

describe('location Redux store', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        location: locationReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().location;
      
      expect(state.currentLocation).toBeNull();
      expect(state.permissionState).toBe('prompt');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).toBeNull();
    });
  });

  describe('synchronous actions', () => {
    it('should set location', () => {
      const location = { lat: 37.7749, lng: -122.4194 };
      
      store.dispatch(setLocation(location));
      
      const state = store.getState().location;
      expect(state.currentLocation).toEqual(location);
      expect(state.lastUpdated).toBeTruthy();
    });

    it('should set permission state', () => {
      store.dispatch(setPermissionState('granted'));
      
      const state = store.getState().location;
      expect(state.permissionState).toBe('granted');
    });

    it('should set loading', () => {
      store.dispatch(setLoading(true));
      
      const state = store.getState().location;
      expect(state.isLoading).toBe(true);
    });

    it('should set error', () => {
      const error = { type: 'PERMISSION_DENIED', message: 'Permission denied' };
      
      store.dispatch(setError(error));
      
      const state = store.getState().location;
      expect(state.error).toEqual(error);
    });

    it('should clear error', () => {
      const error = { type: 'TIMEOUT', message: 'Timeout' };
      store.dispatch(setError(error));
      
      store.dispatch(clearError());
      
      const state = store.getState().location;
      expect(state.error).toBeNull();
    });

    it('should clear location', () => {
      const location = { lat: 37.7749, lng: -122.4194 };
      store.dispatch(setLocation(location));
      
      store.dispatch(clearLocation());
      
      const state = store.getState().location;
      expect(state.currentLocation).toBeNull();
    });

    it('should reset to initial state', () => {
      store.dispatch(setLocation({ lat: 37.7749, lng: -122.4194 }));
      store.dispatch(setPermissionState('granted'));
      store.dispatch(setLoading(true));
      
      store.dispatch(reset());
      
      const state = store.getState().location;
      expect(state.currentLocation).toBeNull();
      expect(state.permissionState).toBe('prompt');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchLocation thunk', () => {
    it('should fetch location successfully', async () => {
      const mockLocation = { lat: 37.7749, lng: -122.4194 };
      geolocationService.getCurrentPosition.mockResolvedValue(mockLocation);

      await store.dispatch(fetchLocation());

      const state = store.getState().location;
      expect(state.currentLocation).toEqual(mockLocation);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle permission denied error', async () => {
      const mockError = {
        type: 'PERMISSION_DENIED',
        message: 'User denied location access',
      };
      geolocationService.getCurrentPosition.mockRejectedValue(mockError);

      await store.dispatch(fetchLocation());

      const state = store.getState().location;
      expect(state.currentLocation).toBeNull();
      expect(state.error).toEqual(mockError);
      expect(state.permissionState).toBe('denied');
      expect(state.isLoading).toBe(false);
    });

    it('should handle timeout error', async () => {
      const mockError = {
        type: 'TIMEOUT',
        message: 'Location request timed out',
      };
      geolocationService.getCurrentPosition.mockRejectedValue(mockError);

      await store.dispatch(fetchLocation());

      const state = store.getState().location;
      expect(state.error).toEqual(mockError);
      expect(state.isLoading).toBe(false);
    });

    it('should set permission to granted on success', async () => {
      const mockLocation = { lat: 37.7749, lng: -122.4194 };
      geolocationService.getCurrentPosition.mockResolvedValue(mockLocation);

      await store.dispatch(fetchLocation());

      const state = store.getState().location;
      expect(state.permissionState).toBe('granted');
    });
  });

  describe('updatePermissionState thunk', () => {
    it('should update permission state', async () => {
      geolocationService.checkPermission.mockResolvedValue('granted');

      await store.dispatch(updatePermissionState());

      const state = store.getState().location;
      expect(state.permissionState).toBe('granted');
    });

    it('should handle denied permission', async () => {
      geolocationService.checkPermission.mockResolvedValue('denied');

      await store.dispatch(updatePermissionState());

      const state = store.getState().location;
      expect(state.permissionState).toBe('denied');
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      const location = { lat: 37.7749, lng: -122.4194 };
      store.dispatch(setLocation(location));
      store.dispatch(setPermissionState('granted'));
    });

    it('selectLocation should return current location', () => {
      const state = store.getState();
      expect(selectLocation(state)).toEqual({ lat: 37.7749, lng: -122.4194 });
    });

    it('selectPermissionState should return permission state', () => {
      const state = store.getState();
      expect(selectPermissionState(state)).toBe('granted');
    });

    it('selectIsLoading should return loading state', () => {
      store.dispatch(setLoading(true));
      const state = store.getState();
      expect(selectIsLoading(state)).toBe(true);
    });

    it('selectError should return error', () => {
      const error = { type: 'TIMEOUT', message: 'Timeout' };
      store.dispatch(setError(error));
      const state = store.getState();
      expect(selectError(state)).toEqual(error);
    });

    it('selectHasLocation should return true when location exists', () => {
      const state = store.getState();
      expect(selectHasLocation(state)).toBe(true);
    });

    it('selectHasLocation should return false when no location', () => {
      store.dispatch(clearLocation());
      const state = store.getState();
      expect(selectHasLocation(state)).toBe(false);
    });

    it('selectIsPermissionGranted should return true when granted', () => {
      const state = store.getState();
      expect(selectIsPermissionGranted(state)).toBe(true);
    });

    it('selectIsPermissionDenied should return true when denied', () => {
      store.dispatch(setPermissionState('denied'));
      const state = store.getState();
      expect(selectIsPermissionDenied(state)).toBe(true);
    });
  });
});
