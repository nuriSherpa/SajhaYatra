const NodeCache = require('node-cache');

// Initialize the cache with a default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

function setInCache(key, value) {
  cache.set(key, value);
}
function getFromCache(key) {
  const cached = cache.get(key);
  if (cached !== undefined) {
    const [value, expiry] = cached;
    if (expiry > Date.now()) {
      return value;
    } else {
      cache.delete(key);
    }
  }
  return undefined;
}

function removeFromCache(key) {
  cache.del(key);
}

module.exports = {
  setInCache,
  getFromCache,
  removeFromCache,
};
