const otplib = require('otplib');
const crypto = require('crypto');
const { getFromCache, setInCache, removeFromCache } = require('../services/cache');

// Configure otplib options
otplib.authenticator.options = {
  crypto: require('crypto'),
  step: 5,
  digits: 6,
  algorithm: 'sha512',
};

// Define the TTL (time to live) for the cached TOTP, in milliseconds
const TOTP_TTL = 30000; // 30 seconds

async function generateTotp(userIdentifier) {
  const salt = crypto.randomBytes(16).toString('hex');
  const secret = crypto.createHash('sha256').update(userIdentifier + salt).digest('base64');

  // Try to retrieve the TOTP from the cache
  const cacheKey = `${userIdentifier}:${secret}`;
  console.log(`Cache key: ${cacheKey}`);
  const cachedTotp = await getFromCache(cacheKey);
  console.log(`Cached TOTP: ${cachedTotp}`);

  if (cachedTotp !== undefined) {
    // Check if the cached TOTP is still valid
    const currentTotp = otplib.authenticator.generate(secret);
    const previousTotp = otplib.authenticator.generate(secret, { time: Date.now() - 30000 });
    if (cachedTotp === currentTotp || cachedTotp === previousTotp) {
      console.log(`Retrieved TOTP from cache: ${cachedTotp}`);
      return { totp: cachedTotp, secret };
    } else {
      // If the cached TOTP is not valid, remove it from the cache
      await removeFromCache(cacheKey);
    }
  }

  // Generate a new TOTP only if there is no cached TOTP or the cached TOTP has expired
  const newTotp = otplib.authenticator.generate(secret);
  await setInCache(cacheKey, newTotp, 'PX', TOTP_TTL);
  console.log(`Generated TOTP and stored in cache: ${newTotp}`);
  return { totp: newTotp, secret };
}

module.exports = {
  generateTotp,
};
