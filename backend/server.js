const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');
const noteRoutes = require('./src/routes/notes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows Frontend to talk to Backend
app.use(express.json()); // Allows Backend to read JSON data

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notes', noteRoutes);

// Fallback Port
const PORT = process.env.PORT || 5001; // Using 5001 avoids the Mac AirPlay conflict!

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/api/v1', (req, res) => res.send('FocusMate API is running... '));