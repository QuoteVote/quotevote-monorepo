import QuoteModel from '~/resolvers/models/QuoteModel';
import { validateCoordinates, getValidatedRadius, calculateDistance } from '~/utils/geolocation';

// Constants for validation
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const DEFAULT_OFFSET = 0;

/**
 * Sanitize and validate limit parameter
 * @param {any} limit - User-provided limit value
 * @returns {number} - Sanitized limit value (between 1 and MAX_LIMIT)
 */
const sanitizeLimit = (limit) => {
  // Convert to number and floor it
  const floorLimit = Math.floor(Number(limit));
  
  // Handle NaN, undefined, null, or invalid values - use default
  if (isNaN(floorLimit) || limit === undefined || limit === null) {
    return DEFAULT_LIMIT;
  }
  
  // Enforce: minimum 1, maximum MAX_LIMIT
  // limit = Math.min(MAX_LIMIT, Math.max(1, floorLimit))
  return Math.min(MAX_LIMIT, Math.max(1, floorLimit));
};

/**
 * Sanitize and validate offset parameter
 * @param {any} offset - User-provided offset value
 * @returns {number} - Sanitized offset value (non-negative integer)
 */
const sanitizeOffset = (offset) => {
  // Convert to number and floor it
  const floorOffset = Math.floor(Number(offset));
  
  // Handle NaN, undefined, null, or invalid values - use default
  if (isNaN(floorOffset) || offset === undefined || offset === null) {
    return DEFAULT_OFFSET;
  }
  
  // Enforce: offset must be non-negative
  // offset = Math.max(0, floorOffset)
  return Math.max(0, floorOffset);
};

/**
 * Query local quotes within a radius of user's location
 */
export const localQuotes = async (root, args, context) => {
  try {
    const { near, radiusKm } = args;
    
    // Sanitize pagination parameters to prevent MongoDB issues
    const sanitizedLimit = sanitizeLimit(args.limit);
    const sanitizedOffset = sanitizeOffset(args.offset);

    // Validate coordinates
    const validation = validateCoordinates(near.latitude, near.longitude);
    if (!validation.valid) {
      throw new Error(`Invalid coordinates: ${validation.error}`);
    }

    // Validate and cap radius
    const validRadius = getValidatedRadius(radiusKm);
    const radiusInMeters = validRadius * 1000;

    // Build query
    const query = {
      isLocal: true,
      deleted: false,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [near.longitude, near.latitude], // GeoJSON format: [lng, lat]
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    // Execute query with sanitized pagination parameters
    const quotes = await QuoteModel.find(query)
      .skip(sanitizedOffset)
      .limit(sanitizedLimit)
      .lean()
      .exec();

    // Calculate distance for each quote (for distanceFromUser field)
    const quotesWithDistance = quotes.map((quote) => {
      if (quote.location && quote.location.coordinates) {
        const distance = calculateDistance(
          { lat: near.latitude, lng: near.longitude },
          { lat: quote.location.coordinates[1], lng: quote.location.coordinates[0] }
        );
        return {
          ...quote,
          distanceFromUser: distance,
        };
      }
      return quote;
    });

    return quotesWithDistance;
  } catch (error) {
    console.error('Error in localQuotes query:', error);
    throw error;
  }
};
