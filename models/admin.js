const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // For password hashing

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Make sure the username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure the email is unique
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email validation regex
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
AdminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
