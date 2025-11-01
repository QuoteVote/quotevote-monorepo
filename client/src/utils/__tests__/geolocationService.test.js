import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentPosition,
  checkPermission,
  isSupported,
  isSecureContext,
  getLocationWithRetry,
  clearCache,
  getCachedLocation,
} from '../geolocationService';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  permissions: {
    query: vi.fn(),
  },
};

describe('geolocationService', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    clearCache();
    
    // Setup navigator mock
    global.navigator.geolocation = mockGeolocation;
    global.navigator.permissions = mockGeolocation.permissions;
  });

  describe('isSupported', () => {
    it('should return true when geolocation is supported', () => {
      expect(isSupported()).toBe(true);
    });

    it('should return false when geolocation is not supported', () => {
      global.navigator.geolocation = undefined;
      expect(isSupported()).toBe(false);
    });
  });

  describe('isSecureContext', () => {
    it('should return true on https', () => {
      Object.defineProperty(window, 'location', {
        value: { protocol: 'https:' },
        writable: true,
      });
      expect(isSecureContext()).toBe(true);
    });

    it('should return true on localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { protocol: 'http:', hostname: 'localhost' },
        writable: true,
      });
      expect(isSecureContext()).toBe(true);
    });

    it('should return false on http (not localhost)', () => {
      Object.defineProperty(window, 'location', {
        value: { protocol: 'http:', hostname: 'example.com' },
        writable: true,
      });
      expect(isSecureContext()).toBe(false);
    });
  });

  describe('getCurrentPosition', () => {
    it('should return position on success', async () => {
      const mockPosition = {
        coords: { latitude: 37.7749, longitude: -122.4194 },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const result = await getCurrentPosition();
      
      expect(result).toEqual({ lat: 37.7749, lng: -122.4194 });
    });

    it('should cache position for 15 minutes', async () => {
      const mockPosition = {
        coords: { latitude: 37.7749, longitude: -122.4194 },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      await getCurrentPosition();
      const cached = getCachedLocation();
      
      expect(cached).toEqual({ lat: 37.7749, lng: -122.4194 });
    });

    it('should reject on permission denied', async () => {
      const mockError = { code: 1, message: 'User denied Geolocation' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      await expect(getCurrentPosition()).rejects.toMatchObject({
        type: 'PERMISSION_DENIED',
      });
    });

    it('should reject on timeout', async () => {
      const mockError = { code: 3, message: 'Timeout' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      await expect(getCurrentPosition()).rejects.toMatchObject({
        type: 'TIMEOUT',
      });
    });

    it('should reject on position unavailable', async () => {
      const mockError = { code: 2, message: 'Position unavailable' };

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      await expect(getCurrentPosition()).rejects.toMatchObject({
        type: 'POSITION_UNAVAILABLE',
      });
    });
  });

  describe('checkPermission', () => {
    it('should return granted when permission is granted', async () => {
      mockGeolocation.permissions.query.mockResolvedValue({ state: 'granted' });

      const result = await checkPermission();
      
      expect(result).toBe('granted');
    });

    it('should return denied when permission is denied', async () => {
      mockGeolocation.permissions.query.mockResolvedValue({ state: 'denied' });

      const result = await checkPermission();
      
      expect(result).toBe('denied');
    });

    it('should return prompt when permission is prompt', async () => {
      mockGeolocation.permissions.query.mockResolvedValue({ state: 'prompt' });

      const result = await checkPermission();
      
      expect(result).toBe('prompt');
    });

    it('should return unsupported when permissions API not available', async () => {
      global.navigator.permissions = undefined;

      const result = await checkPermission();
      
      expect(result).toBe('unsupported');
    });
  });

  describe('getLocationWithRetry', () => {
    it('should return location on first try', async () => {
      const mockPosition = {
        coords: { latitude: 37.7749, longitude: -122.4194 },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const result = await getLocationWithRetry();
      
      expect(result).toEqual({ lat: 37.7749, lng: -122.4194 });
    });

    it('should retry on timeout and succeed', async () => {
      const mockPosition = {
        coords: { latitude: 37.7749, longitude: -122.4194 },
      };

      let attempts = 0;
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        attempts++;
        if (attempts === 1) {
          error({ code: 3, message: 'Timeout' });
        } else {
          success(mockPosition);
        }
      });

      const result = await getLocationWithRetry(2);
      
      expect(result).toEqual({ lat: 37.7749, lng: -122.4194 });
      expect(attempts).toBe(2);
    });

    it('should fail after max retries', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 3, message: 'Timeout' });
      });

      await expect(getLocationWithRetry(3)).rejects.toMatchObject({
        type: 'TIMEOUT',
      });
    });
  });

  describe('clearCache', () => {
    it('should clear cached location', async () => {
      const mockPosition = {
        coords: { latitude: 37.7749, longitude: -122.4194 },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      await getCurrentPosition();
      expect(getCachedLocation()).toBeTruthy();

      clearCache();
      expect(getCachedLocation()).toBeNull();
    });
  });
});
