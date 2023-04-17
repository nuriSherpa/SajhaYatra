require('dotenv').config({ path: '../.env' });

const config = {
  PORT: process.env.PORT || 8080,
  DB_URI:process.env.Mongo_Db_Url,
  TWILIO_SID:process.env.TWILIO_ACCOUNT_SID,
  TWILIO_TOKEN:process.env.TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER:process.env.TWILIO_PHONE_NUMBER,
  EMAIL_SERVICE:process.env.EMAIL_SERVICE,
  EMAIL_USER:process.env.EMAIL_USER,
  EMAIL_PASS:process.env.EMAIL_PASS,
};

module.exports = config;





