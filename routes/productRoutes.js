const express = require('express');
const router = express.Router();
const {
  getProductByCategory,
  getProductById,
  getAllCategories,
  getAllProducts,
} = require('../controllers/productController');

// Route to get products by category
router.get('/category/:category', getProductByCategory);

// Route to get product by ID
router.get('/product/:id', getProductById);

// Route to get all categories
router.get('/categories', getAllCategories);

// Route to get all products
router.get('/product', getAllProducts);

module.exports = router;
