import QuoteModel from '~/resolvers/models/QuoteModel';
import { validateCoordinates, getValidatedRadius, calculateDistance } from '~/utils/geolocation';

/**
 * Query local quotes within a radius of user's location
 */
export const localQuotes = async (root, args, context) => {
  try {
    const { near, radiusKm, limit = 50, offset = 0 } = args;

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

    // Execute query with pagination
    const quotes = await QuoteModel.find(query)
      .skip(offset)
      .limit(limit)
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
