const { TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = require('../config/config');

const client = require('twilio')(TWILIO_SID, TWILIO_TOKEN);

const sendOtpSms = (to, otp) => {
  client.messages.create({
    to,
    from: TWILIO_NUMBER,
    body: `Your OTP is ${otp}. Please don't share it with anyone.`,
  })
  .then(message => console.log(message.sid))
  .catch(error => console.error(error));
};

module.exports = sendOtpSms;
