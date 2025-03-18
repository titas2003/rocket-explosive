// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Product = require('../models/product');
const Category = require('../models/category');

// Register Admin (with password hashing)
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or Email already in use' });
    }

    // Create new Admin
    const newAdmin = new Admin({
      username,
      email,
      password,
    });

    // Save new Admin to database
    await newAdmin.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin Login (with JWT generation)
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get available stock per product
const getAvailableStock = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// List new product (with multiple images)
const listNewProduct = async (req, res) => {
  // Handle file upload using Multer
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const { name, price, stock, category } = req.body;
  let categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    categoryDoc = new Category({ name: category });
    await categoryDoc.save();
  }

  try {
    // Create a new product and save it to the database
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      // If the product exists for the seller, update the quantity
      existingProduct.stock = Number(existingProduct.stock)+Number(stock);
      await existingProduct.save();
      return res.status(200).json({ success: true, message: "Product quantity updated.", product: existingProduct });
    }
    else {
      const newProduct = new Product({
        name,
        price,
        stock,
        images: imagePath,
        category: categoryDoc.name // Save category as a string
      });

      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Controller for getting available products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve products', error: err.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, stock, images } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, stock, images },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAvailableStock,
  listNewProduct,
  updateProduct,
};
