// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const associateRoutes = require('./routes/associateRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error: ', err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/associate', associateRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on a port ${port}`);
});
