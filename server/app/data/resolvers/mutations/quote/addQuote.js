import QuoteModel from '../../models/QuoteModel';
import PostModel from '../../models/PostModel';
import { logActivity } from '../../utils/activities_utils';
import { logger } from '../../../utils/logger';
import { updateTrending } from '../../utils/post_utils';
import {
  validateCoordinates,
  roundCoordinates,
  generateGeohash,
  reverseGeocode,
} from '../../../utils/geolocation';

export const addQuote = (pubsub) => {
  return async (_, args) => {
    logger.info('Function: addQuote');
    const quoteData = { ...args.quote, created: new Date() };

    // Handle location data if this is a local quote
    if (quoteData.isLocal && quoteData.location) {
      try {
        const { latitude, longitude } = quoteData.location;

        // Validate coordinates
        const validation = validateCoordinates(latitude, longitude);
        if (!validation.valid) {
          throw new Error(`Invalid location coordinates: ${validation.error}`);
        }

        // Round coordinates for privacy (3-4 decimal places)
        const rounded = roundCoordinates(latitude, longitude);

        // Generate geohash for additional privacy layer
        const geohash = generateGeohash(rounded.lat, rounded.lng);

        // Get place label via reverse geocoding
        let placeLabel = 'Unknown Location';
        try {
          placeLabel = await reverseGeocode(rounded.lat, rounded.lng);
        } catch (geocodeError) {
          logger.error('Reverse geocoding failed:', geocodeError);
          // Continue with default label
        }

        // Store location in GeoJSON format
        quoteData.location = {
          type: 'Point',
          coordinates: [rounded.lng, rounded.lat], // [longitude, latitude]
          geohash,
        };
        quoteData.placeLabel = placeLabel;

        logger.info(`Local quote created near: ${placeLabel}`);
      } catch (locationError) {
        logger.error('Error processing location data:', locationError);
        throw new Error(`Failed to process location: ${locationError.message}`);
      }
    } else {
      // Ensure location fields are not set for global quotes
      delete quoteData.location;
      delete quoteData.placeLabel;
      quoteData.isLocal = false;
    }

    try {
      const quote = await new QuoteModel(quoteData).save();
      await updateTrending(quote.postId);
      const post = await PostModel.findById(quote.postId);
      await logActivity(
        'QUOTED',
        { userId: quote.quoter, postId: quote.postId, quoteId: quote._id },
        `Quoted on '${post.title}' post.`,
      );
      return quote;
    } catch (err) {
      logger.error('Error saving quote:', err);
      throw new Error(err);
    }
  };
};
