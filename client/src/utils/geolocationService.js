/**
 * Geolocation Service
 * Browser geolocation wrapper with caching and error handling
 */

// Cache configuration
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let cachedLocation = null;
let cacheTimestamp = null;

/**
 * Error types for geolocation
 */
export const GeoLocationError = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE: 'POSITION_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  NOT_HTTPS: 'NOT_HTTPS',
  UNKNOWN: 'UNKNOWN',
};

/**
 * User-friendly error messages
 */
export const getErrorMessage = (errorType) => {
  switch (errorType) {
    case GeoLocationError.PERMISSION_DENIED:
      return 'Location access was denied. To enable it, check your browser settings.';
    case GeoLocationError.POSITION_UNAVAILABLE:
      return 'Unable to determine your location. Please check your device settings.';
    case GeoLocationError.TIMEOUT:
      return 'Location request timed out. Please try again.';
    case GeoLocationError.NOT_SUPPORTED:
      return 'Geolocation is not supported by your browser.';
    case GeoLocationError.NOT_HTTPS:
      return 'Location access requires a secure connection (HTTPS).';
    default:
      return 'An unknown error occurred while accessing your location.';
  }
};

/**
 * Check if browser supports geolocation
 * @returns {boolean}
 */
export const isSupported = () => {
  return 'geolocation' in navigator;
};

/**
 * Check if page is served over HTTPS or localhost
 * Required for geolocation API in modern browsers
 * @returns {boolean}
 */
export const isSecureContext = () => {
  return window.isSecureContext || window.location.hostname === 'localhost';
};

/**
 * Check geolocation permission state
 * @returns {Promise<string>} - 'granted', 'denied', 'prompt', or 'unsupported'
 */
export const checkPermission = async () => {
  if (!isSupported()) {
    return 'unsupported';
  }

  // Check if Permissions API is available
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'prompt'; // Assume prompt if we can't check
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.warn('Permission check failed:', error);
    return 'prompt'; // Fallback to prompt
  }
};

/**
 * Get current position from browser geolocation API
 * Includes caching to avoid repeated API calls
 * @param {object} options - Configuration options
 * @param {number} options.timeout - Timeout in milliseconds (default: 10000)
 * @param {boolean} options.enableHighAccuracy - Request high accuracy (default: false)
 * @param {number} options.maximumAge - Maximum cached position age (default: 0)
 * @param {boolean} options.useCache - Use internal cache (default: true)
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentPosition = async (options = {}) => {
  const {
    timeout = 10000,
    enableHighAccuracy = false,
    maximumAge = 0,
    useCache = true,
  } = options;

  // Check browser support
  if (!isSupported()) {
    throw {
      type: GeoLocationError.NOT_SUPPORTED,
      message: getErrorMessage(GeoLocationError.NOT_SUPPORTED),
    };
  }

  // Check secure context
  if (!isSecureContext()) {
    throw {
      type: GeoLocationError.NOT_HTTPS,
      message: getErrorMessage(GeoLocationError.NOT_HTTPS),
    };
  }

  // Check cache
  if (useCache && cachedLocation && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp;
    if (cacheAge < CACHE_DURATION_MS) {
      console.log('[Geolocation] Using cached location', {
        age: Math.round(cacheAge / 1000) + 's',
        location: cachedLocation,
      });
      return cachedLocation;
    }
  }

  // Request new position
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update cache
        cachedLocation = location;
        cacheTimestamp = Date.now();

        console.log('[Geolocation] Position acquired', {
          location,
          accuracy: position.coords.accuracy + 'm',
        });

        resolve(location);
      },
      (error) => {
        let errorType;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = GeoLocationError.PERMISSION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = GeoLocationError.POSITION_UNAVAILABLE;
            break;
          case error.TIMEOUT:
            errorType = GeoLocationError.TIMEOUT;
            break;
          default:
            errorType = GeoLocationError.UNKNOWN;
        }

        console.error('[Geolocation] Error:', errorType, error.message);

        reject({
          type: errorType,
          message: getErrorMessage(errorType),
          originalError: error,
        });
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  });
};

/**
 * Clear cached location
 * Useful for testing or forcing a fresh location request
 */
export const clearCache = () => {
  cachedLocation = null;
  cacheTimestamp = null;
  console.log('[Geolocation] Cache cleared');
};

/**
 * Get cached location if available
 * @returns {{lat: number, lng: number} | null}
 */
export const getCachedLocation = () => {
  if (cachedLocation && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp;
    if (cacheAge < CACHE_DURATION_MS) {
      return cachedLocation;
    }
  }
  return null;
};

/**
 * Request location with retry logic
 * @param {number} maxRetries - Maximum number of retry attempts (default: 2)
 * @param {number} retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getLocationWithRetry = async (maxRetries = 2, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Geolocation] Retry attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      const location = await getCurrentPosition({
        timeout: 10000 + (attempt * 5000), // Increase timeout on retries
        useCache: attempt === 0, // Only use cache on first attempt
      });
      
      return location;
    } catch (error) {
      lastError = error;
      
      // Don't retry on permission denied
      if (error.type === GeoLocationError.PERMISSION_DENIED) {
        throw error;
      }
    }
  }
  
  throw lastError;
};

export default {
  getCurrentPosition,
  checkPermission,
  isSupported,
  isSecureContext,
  clearCache,
  getCachedLocation,
  getLocationWithRetry,
  GeoLocationError,
  getErrorMessage,
};
