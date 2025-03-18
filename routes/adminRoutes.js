// routes/adminRoutes.js
const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAvailableStock,
  listNewProduct,
  updateProduct,
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');

const upload = require('../middleware/multerConfig');

const router = express.Router();

// Admin Register
router.post('/register', registerAdmin);

// Admin Login
router.post('/login', loginAdmin);

// Protected routes - Admin gets available stock
router.get('/stock', getAvailableStock);

// Admin lists new product
router.post('/product', upload, listNewProduct);

// Admin updates product
router.put('/product/:productId', protect, updateProduct);

module.exports = router;
