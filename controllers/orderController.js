const Order = require('../models/order');
const Product = require('../models/product');  // Import Product model for validation

// OrderNow API
exports.createOrder = async (req, res) => {
  const {
    associateEmail,
    products,
    customerId,
    customerName,
    customerPhoneNumber,
    paymentStatus,
    warrantyTill
  } = req.body;

  // Validation: Check if products array is provided and not empty
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'No products selected for the order.' });
  }

  try {
    // Validate that all products exist in the database
    const productIds = products.map(item => item.productId);
    const foundProducts = await Product.find({ '_id': { $in: productIds } });

    if (foundProducts.length !== products.length) {
      return res.status(400).json({ message: 'One or more products not found in the database.' });
    }

    // Calculate total billable price
    let totalPrice = 0;
    products.forEach(item => {
      const product = foundProducts.find(p => p._id.toString() === item.productId);
      totalPrice += product.price * item.quantity;
    });

    // Calculate warranty date (1 year after order date)
    const warrantyDate = new Date();
    warrantyDate.setFullYear(warrantyDate.getFullYear() + 1);

    // Create new Order object
    const newOrder = new Order({
      associateEmail,
      products,
      customerId,
      customerName,
      customerPhoneNumber,
      paymentStatus,
      warrantyTill: warrantyDate,
      totalBillablePrice: totalPrice
    });

    // Save the order to the database
    await newOrder.save();

    // Send response
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing the order', error: err.message });
  }
};



// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message,
    });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params._id).populate('products.productId').populate('customerId');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving order',
      error: error.message,
    });
  }
};
