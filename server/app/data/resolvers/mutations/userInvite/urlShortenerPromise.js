const shortUrl = require('node-url-shortener');
import { logger } from '../../../utils/logger';

export const urlShortenerPromise = function (longUrl) {
  return new Promise((resolve) => {
    shortUrl.short(longUrl, (err, url) => {
      logger.debug('url shortened', { longUrl, shortUrl: url });
      resolve(url);
    });
  });
};
