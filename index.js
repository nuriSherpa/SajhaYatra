// Require dependencies
const express = require('express');
require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const cookieParser = require('cookie-Parser');
const errorMiddleware = require('./middleware/error_handler');
// Require configuration settings
const { PORT } = require('./config/config');
const connectToDatabase = require('./db/connection');

// Require routes
const router = require('./routes/route');

// Create the express app
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use('/api/v1', router);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

app.use(errorMiddleware);

const startServer = () => {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};
connectToDatabase()
  .then(startServer)
  .catch((err) => {
    console.error('Error starting server: ', err);
    process.exit(1);
  });
