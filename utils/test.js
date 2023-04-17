const express = require('express');
const app = express();

class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

app.post('/user', (req, res, next) => {
  try {
    if (!req.body.name) {
      throw new InvalidInputError('Name is required.');
    }
    // Some code that might throw a database error
    res.json({ message: 'User created successfully.' });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof InvalidInputError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof DatabaseError) {
    res.status(500).json({ error: 'Database error.' });
  } else {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});
