const mongoose=require('mongoose');

// Require configuration settings
const { DB_URI } = require('../config/config');


//Connect to db
const connectToDatabase = async () => {
    try {
      await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to database');
    } catch (err) {
      console.error('Error connecting to database: ', err);
      throw err;
    }
  };
  
  module.exports = connectToDatabase;

