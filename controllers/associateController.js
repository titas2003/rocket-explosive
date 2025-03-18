const Associate = require('../models/associate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new associate
exports.registerAssociate = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if associate already exists
    const existingAssociate = await Associate.findOne({ email });
    if (existingAssociate) {
      return res.status(400).json({ message: 'Associate already exists' });
    }

    // Create new associate
    const associate = new Associate({ name, email, password });
    await associate.save();

    // Generate JWT token
    const token = associate.generateToken();

    res.status(201).json({ message: 'Associate registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register associate', error: err.message });
  }
};

// Login associate
exports.loginAssociate = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find associate by email
    const associate = await Associate.findOne({ email });
    if (!associate) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await associate.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = associate.generateToken();

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to login associate', error: err.message });
  }
};
