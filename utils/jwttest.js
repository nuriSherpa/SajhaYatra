const jwt = require('jsonwebtoken');
const axios = require('axios');


const private_key = fs.readFileSync('../private.key');
const public_key = fs.readFileSync('../public.key');

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

function generateAccessToken(payload) {
  const token = jwt.sign(payload, private_key, { algorithm: 'ES256' });
  return token;
}

function generateRefreshToken(payload) {
  const token = jwt.sign(payload, private_key, { algorithm: 'ES256' });
  return token;
}

function verifyAccessToken(token) {
  const payload = jwt.verify(token, public_key, { algorithms: ['ES256'] });
  return payload;
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, public_key, { algorithms: ['ES256'] });
  return payload;
}

function refreshAccessToken() {
  return axios.post('/api/refresh-token', { refreshToken })
    .then((response) => {
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      accessToken = newAccessToken;
      return newAccessToken;
    })
    .catch((error) => {
      console.error(error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    });
}

function checkAccessTokenExpiration() {
  const payload = verifyAccessToken(accessToken);
  const now = Math.floor(Date.now() / 1000);
  const timeToExpiration = payload.exp - now;
  if (timeToExpiration < 300) { // less than 5 minutes until expiration
    return refreshAccessToken();
  }
  return Promise.resolve(accessToken);
}

// Check the access token expiration every minute
setInterval(checkAccessTokenExpiration, 60 * 1000);

// Use the access token to make API requests
axios.get('/api/data', { headers: { Authorization: `Bearer ${accessToken}` } })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
