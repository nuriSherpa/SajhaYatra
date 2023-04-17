const { setCachedValue, getCachedValue, LINK_EXPIRATION_TIME } = require('../services/cache');
const {generateTotp, secret}= require('./generateOtp');

// Generate a verification link containing email, TOTP, timestamp and signature
function generateVerificationLink(email) {
  // const secret = generateSecret();
  const timestamp = Date.now();
  const otp = generateTotp(secret);
  const signatureKey = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', signatureKey).update(`${email}${timestamp}${otp}`).digest('hex');
  const link = `https://example.com/verify?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&timestamp=${timestamp}&signature=${encodeURIComponent(signature)}`;
  const cacheKey = `verification-link:${email}`;

  // Store the email, link, and signature key in the cache with time-based expiration
  setCachedValue(cacheKey, { email, link, signatureKey }, LINK_EXPIRATION_TIME);
 console.log(link);
  return link;
}

// Verify the signature of the verification link
async function verifyVerificationLinkSignature(email, timestamp, otp, signature) {
  const cacheKey = `verification-link:${email}`;
  const cachedValue = await getCachedValue(cacheKey);

  if (!cachedValue) {
    return false;
  }

  // Check if the link has expired
  if (Date.now() > (cachedValue.timestamp + LINK_EXPIRATION_TIME * 1000)) {
    return false;
  }

  // Check if the link has already been used
  if (cachedValue.used) {
    return false;
  }

  // Verify the signature
  const signatureKey = cachedValue.signatureKey;
  const expectedSignature = crypto.createHmac('sha256', signatureKey).update(`${email}${timestamp}${otp}`).digest('hex');
  if (signature !== expectedSignature) {
    return false;
  }

  // Mark the link as used
  setCachedValue(cacheKey, { ...cachedValue, used: true }, LINK_EXPIRATION_TIME);

  return true;
}

generateVerificationLink('tendinuri@gmail.com');
