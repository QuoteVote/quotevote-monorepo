import ngeohash from 'ngeohash';
import NodeGeocoder from 'node-geocoder';

// Safe default values
const SAFE_DEFAULTS = {
  COORDINATE_PRECISION: 3,
  DEFAULT_RADIUS_KM: 10,
  MAX_RADIUS_KM: 100,
};

/**
 * Parse and validate configuration from environment variables
 * Falls back to safe defaults if parsing fails or values are invalid
 */
const parseConfig = () => {
  const config = { ...SAFE_DEFAULTS };

  // Parse COORDINATE_PRECISION
  const precisionEnv = process.env.GEO_PRECISION_DECIMALS;
  if (precisionEnv !== undefined) {
    const precision = parseInt(precisionEnv, 10);
    if (isNaN(precision) || precision < 0) {
      console.warn(
        `[Geolocation] Invalid GEO_PRECISION_DECIMALS="${precisionEnv}". ` +
        `Must be a non-negative integer. Using default: ${SAFE_DEFAULTS.COORDINATE_PRECISION}`
      );
    } else {
      config.COORDINATE_PRECISION = precision;
    }
  }

  // Parse MAX_RADIUS_KM
  const maxRadiusEnv = process.env.GEO_MAX_RADIUS_KM;
  if (maxRadiusEnv !== undefined) {
    const maxRadius = parseFloat(maxRadiusEnv);
    if (isNaN(maxRadius) || maxRadius <= 0) {
      console.warn(
        `[Geolocation] Invalid GEO_MAX_RADIUS_KM="${maxRadiusEnv}". ` +
        `Must be a positive number. Using default: ${SAFE_DEFAULTS.MAX_RADIUS_KM}`
      );
    } else {
      config.MAX_RADIUS_KM = maxRadius;
    }
  }

  // Parse DEFAULT_RADIUS_KM
  const defaultRadiusEnv = process.env.GEO_DEFAULT_RADIUS_KM;
  if (defaultRadiusEnv !== undefined) {
    const defaultRadius = parseFloat(defaultRadiusEnv);
    if (isNaN(defaultRadius) || defaultRadius <= 0) {
      console.warn(
        `[Geolocation] Invalid GEO_DEFAULT_RADIUS_KM="${defaultRadiusEnv}". ` +
        `Must be a positive number. Using default: ${SAFE_DEFAULTS.DEFAULT_RADIUS_KM}`
      );
    } else {
      // Ensure DEFAULT_RADIUS_KM does not exceed MAX_RADIUS_KM
      if (defaultRadius > config.MAX_RADIUS_KM) {
        console.warn(
          `[Geolocation] GEO_DEFAULT_RADIUS_KM="${defaultRadius}" exceeds ` +
          `GEO_MAX_RADIUS_KM="${config.MAX_RADIUS_KM}". Clamping to max.`
        );
        config.DEFAULT_RADIUS_KM = config.MAX_RADIUS_KM;
      } else {
        config.DEFAULT_RADIUS_KM = defaultRadius;
      }
    }
  }

  return config;
};

// Parse and validate configuration
const CONFIG = parseConfig();

// Export validated configuration constants
const COORDINATE_PRECISION = CONFIG.COORDINATE_PRECISION;
const DEFAULT_RADIUS_KM = CONFIG.DEFAULT_RADIUS_KM;
const MAX_RADIUS_KM = CONFIG.MAX_RADIUS_KM;

// Geocoding cache (in-memory, could be Redis in production)
// NOTE: In-memory Map can grow unbounded with high traffic and long TTLs.
// For production, consider:
// - Using Redis with automatic expiration
// - Implementing cache size limits (LRU eviction)
// - Adding request deduplication to prevent concurrent API calls for same location
const geocodeCache = new Map();

// Parse and validate GEOCODING_CACHE_TTL_HOURS
let cacheTTLHours = parseInt(process.env.GEOCODING_CACHE_TTL_HOURS || '168', 10);
if (!Number.isInteger(cacheTTLHours) || cacheTTLHours <= 0) {
  console.warn(
    `[Geolocation] Invalid GEOCODING_CACHE_TTL_HOURS="${process.env.GEOCODING_CACHE_TTL_HOURS}". ` +
    `Must be a positive integer. Using default: 168 hours`
  );
  cacheTTLHours = 168;
}
const CACHE_TTL_MS = cacheTTLHours * 60 * 60 * 1000;

// Initialize geocoder
const geocoderOptions = {
  provider: process.env.GEOCODING_PROVIDER || 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
};

// Add API key if using a paid provider
if (process.env.GEOCODING_API_KEY) {
  geocoderOptions.apiKey = process.env.GEOCODING_API_KEY;
}

const geocoder = NodeGeocoder(geocoderOptions);

/**
 * Round coordinates to specified decimal places for privacy
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Number of decimal places (default: 3)
 * @returns {object} - Rounded coordinates {lat, lng}
 */
export function roundCoordinates(lat, lng, precision = COORDINATE_PRECISION) {
  const factor = Math.pow(10, precision);
  return {
    lat: Math.round(lat * factor) / factor,
    lng: Math.round(lng * factor) / factor,
  };
}

/**
 * Validate coordinates are within valid ranges and not obviously spoofed
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {object} - {valid: boolean, error?: string}
 */
export function validateCoordinates(lat, lng) {
  // Check if coordinates are numbers
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { valid: false, error: 'Coordinates must be numbers' };
  }

  // Check if coordinates are finite (not NaN, Infinity, etc.)
  if (!isFinite(lat) || !isFinite(lng)) {
    return { valid: false, error: 'Coordinates must be finite numbers' };
  }

  // Validate latitude range
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }

  // Validate longitude range
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }

  // Check for null island (0, 0) which is often a sign of spoofing or error
  if (lat === 0 && lng === 0) {
    return { valid: false, error: 'Invalid coordinates (null island)' };
  }

  return { valid: true };
}

/**
 * Generate geohash from coordinates for additional privacy layer
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Geohash precision (default: 6 = ~1.2km)
 * @returns {string} - Geohash string
 */
export function generateGeohash(lat, lng, precision = 6) {
  return ngeohash.encode(lat, lng, precision);
}

/**
 * Decode geohash to approximate coordinates
 * @param {string} geohash - Geohash string
 * @returns {object} - {lat, lng}
 */
export function decodeGeohash(geohash) {
  const decoded = ngeohash.decode(geohash);
  return { lat: decoded.latitude, lng: decoded.longitude };
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {object} point1 - {lat, lng}
 * @param {object} point2 - {lat, lng}
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Reverse geocode coordinates to coarse location label
 * Uses caching to minimize API calls
 * 
 * Privacy: Returns coarse labels (city/state/country only, no street address)
 * with "near" prefix. Coordinates are rounded to ~1km for cache keys.
 * 
 * NOTE: Concurrent requests with same cache key may result in duplicate API calls
 * before first result is cached. This is a minor optimization opportunity for
 * high-traffic production deployments (could implement request deduplication).
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Place label (e.g., "near Oakland, CA")
 */
export async function reverseGeocode(lat, lng) {
  // Create cache key from rounded coordinates
  const rounded = roundCoordinates(lat, lng, 2); // Use 2 decimals for cache key (~1km)
  const cacheKey = `${rounded.lat},${rounded.lng}`;

  // Check cache
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.label;
  }

  try {
    // Call geocoding service
    const results = await geocoder.reverse({ lat, lon: lng });

    if (results && results.length > 0) {
      const result = results[0];
      
      // Create coarse label (city, state/country only - no street address)
      let label = '';
      
      if (result.city) {
        label = result.city;
      } else if (result.county) {
        label = result.county;
      }

      if (result.state || result.stateCode) {
        label += label ? `, ${result.stateCode || result.state}` : (result.stateCode || result.state);
      } else if (result.country) {
        label += label ? `, ${result.country}` : result.country;
      }

      // Fallback if no label created
      if (!label) {
        label = result.country || 'Unknown Location';
      }

      // Add "near" prefix for privacy
      const placeLabel = `near ${label}`;

      // Cache the result
      geocodeCache.set(cacheKey, {
        label: placeLabel,
        timestamp: Date.now(),
      });

      return placeLabel;
    }

    return 'near Unknown Location';
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return 'near Unknown Location';
  }
}

/**
 * Check if a point is within a given radius of a center point
 * @param {object} center - {lat, lng}
 * @param {object} point - {lat, lng}
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean}
 */
export function isWithinRadius(center, point, radiusKm) {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
}

/**
 * Get configured default radius
 * @returns {number}
 */
export function getDefaultRadius() {
  return DEFAULT_RADIUS_KM;
}

/**
 * Get configured max radius and enforce cap
 * @param {number} requestedRadius
 * @returns {number}
 */
export function getValidatedRadius(requestedRadius) {
  if (!requestedRadius) {
    return DEFAULT_RADIUS_KM;
  }
  return Math.min(requestedRadius, MAX_RADIUS_KM);
}

/**
 * Clear geocoding cache (useful for testing)
 */
export function clearGeocodeCache() {
  geocodeCache.clear();
}
