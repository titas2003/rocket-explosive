const Product = require('../models/product');
const Category = require('../models/category');

// 1. Get Products by Category
const getProductByCategory = async (req, res) => {
  const { category } = req.params;  // Get the category from the request parameters

  try {
    const products = await Product.find({ category });  // Fetch products by category
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }
    res.status(200).json(products);  // Return the products
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category', error: err.message });
  }
};

// 2. Get Product by ID
const getProductById = async (req, res) => {
  const _id = req.params.id;  // Get the product ID from the request parameters
  console.log(_id);
  try {
    const product = await Product.findById({_id});  // Find the product by its ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);  // Return the product
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product by ID', error: err.message });
  }
};

// 3. Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();  // Fetch all categories
    res.status(200).json(categories);  // Return the categories
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

// 4. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products
    res.status(200).json(products);  // Return the products
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

module.exports = {
  getProductByCategory,
  getProductById,
  getAllCategories,
  getAllProducts,
};
