const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS middleware
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'fitflow'
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string:', process.env.MONGODB_URI);
  process.exit(1);
});

// Import route handlers
const accountRoutes = require('./routes/account');
const programRoutes = require('./routes/program');
const mealsRoutes = require('./routes/meals');

// Use routes
app.use('/api/account', accountRoutes);
app.use('/api/program', programRoutes);
app.use('/api/meals', mealsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});