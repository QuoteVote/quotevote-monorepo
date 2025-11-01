const {
  roundCoordinates,
  validateCoordinates,
  generateGeohash,
  decodeGeohash,
  calculateDistance,
  isWithinRadius,
  getDefaultRadius,
  getValidatedRadius,
} = require('../../utils/geolocation');

describe('Geolocation Utilities', () => {
  describe('roundCoordinates', () => {
    it('should round coordinates to specified precision', () => {
      const result = roundCoordinates(37.774929, -122.419418, 3);
      
      expect(result.lat).toBe(37.775);
      expect(result.lng).toBe(-122.419);
    });

    it('should default to 3 decimal places', () => {
      const result = roundCoordinates(37.774929, -122.419418);
      
      expect(result.lat).toBe(37.775);
      expect(result.lng).toBe(-122.419);
    });

    it('should handle 4 decimal precision', () => {
      const result = roundCoordinates(37.774929, -122.419418, 4);
      
      expect(result.lat).toBe(37.7749);
      expect(result.lng).toBe(-122.4194);
    });
  });

  describe('validateCoordinates', () => {
    it('should return true for valid coordinates', () => {
      expect(validateCoordinates(37.7749, -122.4194)).toBe(true);
    });

    it('should return false for latitude out of range', () => {
      expect(validateCoordinates(91, -122.4194)).toBe(false);
      expect(validateCoordinates(-91, -122.4194)).toBe(false);
    });

    it('should return false for longitude out of range', () => {
      expect(validateCoordinates(37.7749, 181)).toBe(false);
      expect(validateCoordinates(37.7749, -181)).toBe(false);
    });

    it('should return false for null island (0, 0)', () => {
      expect(validateCoordinates(0, 0)).toBe(false);
    });

    it('should return false for near null island', () => {
      expect(validateCoordinates(0.00001, 0.00001)).toBe(false);
    });

    it('should return true for valid coordinates near null island threshold', () => {
      expect(validateCoordinates(0.2, 0.2)).toBe(true);
    });
  });

  describe('generateGeohash', () => {
    it('should generate geohash with default precision', () => {
      const hash = generateGeohash(37.7749, -122.4194);
      
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(6); // Default precision
    });

    it('should generate geohash with specified precision', () => {
      const hash = generateGeohash(37.7749, -122.4194, 8);
      
      expect(hash.length).toBe(8);
    });

    it('should generate consistent hashes for same location', () => {
      const hash1 = generateGeohash(37.7749, -122.4194);
      const hash2 = generateGeohash(37.7749, -122.4194);
      
      expect(hash1).toBe(hash2);
    });
  });

  describe('decodeGeohash', () => {
    it('should decode geohash to coordinates', () => {
      const originalLat = 37.7749;
      const originalLng = -122.4194;
      const hash = generateGeohash(originalLat, originalLng);
      
      const decoded = decodeGeohash(hash);
      
      // Should be close to original (within precision tolerance)
      expect(Math.abs(decoded.lat - originalLat)).toBeLessThan(0.01);
      expect(Math.abs(decoded.lng - originalLng)).toBeLessThan(0.01);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const point1 = { lat: 37.7749, lng: -122.4194 }; // San Francisco
      const point2 = { lat: 37.8044, lng: -122.2712 }; // Oakland
      
      const distance = calculateDistance(point1, point2);
      
      // Distance is approximately 13-14 km
      expect(distance).toBeGreaterThan(13);
      expect(distance).toBeLessThan(15);
    });

    it('should return 0 for same location', () => {
      const point = { lat: 37.7749, lng: -122.4194 };
      
      const distance = calculateDistance(point, point);
      
      expect(distance).toBe(0);
    });

    it('should calculate long distances accurately', () => {
      const sanFrancisco = { lat: 37.7749, lng: -122.4194 };
      const newYork = { lat: 40.7128, lng: -74.0060 };
      
      const distance = calculateDistance(sanFrancisco, newYork);
      
      // Distance is approximately 4130 km
      expect(distance).toBeGreaterThan(4100);
      expect(distance).toBeLessThan(4200);
    });
  });

  describe('isWithinRadius', () => {
    it('should return true for points within radius', () => {
      const center = { lat: 37.7749, lng: -122.4194 };
      const nearby = { lat: 37.7849, lng: -122.4194 }; // ~1.1 km away
      
      expect(isWithinRadius(center, nearby, 5)).toBe(true);
    });

    it('should return false for points outside radius', () => {
      const center = { lat: 37.7749, lng: -122.4194 }; // San Francisco
      const farAway = { lat: 37.8044, lng: -122.2712 }; // Oakland, ~14 km
      
      expect(isWithinRadius(center, farAway, 10)).toBe(false);
    });

    it('should return true for same location', () => {
      const point = { lat: 37.7749, lng: -122.4194 };
      
      expect(isWithinRadius(point, point, 1)).toBe(true);
    });
  });

  describe('getDefaultRadius', () => {
    it('should return default radius', () => {
      const radius = getDefaultRadius();
      
      expect(radius).toBe(10); // Default is 10 km
    });
  });

  describe('getValidatedRadius', () => {
    it('should return requested radius if valid', () => {
      expect(getValidatedRadius(5)).toBe(5);
      expect(getValidatedRadius(50)).toBe(50);
    });

    it('should cap at maximum radius', () => {
      expect(getValidatedRadius(200)).toBe(100); // Max is 100 km
    });

    it('should use default for invalid values', () => {
      expect(getValidatedRadius(-5)).toBe(10);
      expect(getValidatedRadius(0)).toBe(10);
      expect(getValidatedRadius(null)).toBe(10);
      expect(getValidatedRadius(undefined)).toBe(10);
    });
  });
});
