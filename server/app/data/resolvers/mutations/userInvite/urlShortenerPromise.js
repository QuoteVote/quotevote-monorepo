const shortUrl = require('node-url-shortener');

export const urlShortenerPromise = function (longUrl) {
  return new Promise((resolve) => {
    shortUrl.short(longUrl, (err, url) => {
      console.log('url shortened from %s to %s', longUrl, url);
      resolve(url);
    });
  });
};
