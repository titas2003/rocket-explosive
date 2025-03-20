const Order = require('../models/order');
const Product = require('../models/product');  // Import Product model for validation
const transporter = require('../controllers/mailconf');

// OrderNow API
exports.createOrder = async (req, res) => {
  const {
    associateEmail,
    products,
    customerId,
    orderId,
    customerName,
    customerEmail,
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
      orderId,
      customerName,
      customerEmail,
      customerPhoneNumber,
      paymentStatus,
      warrantyTill: warrantyDate,
      totalBillablePrice: totalPrice
    });

    // Save the order to the database
    await newOrder.save();

    const mailOptions = {
      from: 'nomail02024@gmail.com',
      to: customerEmail,
      subject: `Order ID: ${orderId} | Order Delivered to ${customerName}`,
      text: `Dear ${customerName}.\n\nYour Order with order ID: ${orderId} have been successfully delivered.\nTotal Price paid: ${totalPrice} Rupees Only.\nWarranty expires in: ${warrantyDate} \nPlease find the order summary in: https://terrible-eagle-42.telebit.io/order-summary/${orderId}\n\nThanks and Regards,\nRocket Computers`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Failed to send order status mail');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Order status mail sent successfully');
      }
    });
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
  const orderId = req.params.id;
  console.log(orderId);
  try {
    const order = await Order.find({ orderId: orderId });

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
