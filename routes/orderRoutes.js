// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/order', orderController.createOrder);

// Route to get all orders
router.get('/orders', orderController.getOrders);

// Route to get a single order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;
