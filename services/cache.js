const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis server');
});

client.on('error', (error) => {
  console.error('Redis error:', error);
});

// Promisify Redis commands for easier use
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

// Define the TTL (time to live) for the cached TOTP, in seconds
const TOTP_TTL = 30;

function getFromCache(key) {
  return getAsync(key)
    .then((value) => {
      if (value) {
        const [data, expiresAt] = JSON.parse(value);
        if (Date.now() < expiresAt) {
          return data;
        } else {
          // If the cached data has expired, delete it from Redis
          delAsync(key);
        }
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Redis error:', error);
      return undefined;
    });
}

function setInCache(key, value) {
  const expiresAt = Date.now() + TOTP_TTL * 1000;
  return setAsync(key, JSON.stringify([value, expiresAt]), 'EX', TOTP_TTL)
    .catch((error) => {
      console.error('Redis error:', error);
    });
}

function removeFromCache(key) {
  return delAsync(key)
    .catch((error) => {
      console.error('Redis error:', error);
    });
}

module.exports = {
  getFromCache,
  setInCache,
  removeFromCache,
};
