const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this backend [cite: 356]
app.use(express.json()); // Parses incoming JSON requests [cite: 78]

app.use('/api/v1/auth', authRoutes); // [cite: 77]
app.use('/api/v1/tasks', require('./routes/tasks'));
app.use('/api/v1/notes', require('./routes/notes'));

// Base route for testing
app.get('/', (req, res) => {
  res.send('FocusMate API is running...');
});

module.exports = app;