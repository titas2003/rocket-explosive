// models/Order.js
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  associateEmail: {
    type: String,
    required: true,
    trim: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],

  orderId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    ref: 'Customer',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail:
  {
    type: String,
    required: true
  },
  customerPhoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validate for 10 digits
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
  },
  warrantyTill: {
    type: Date,
    required: true,
  },
  totalBillablePrice: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

// Calculate the total billable price before saving the order
orderSchema.pre('save', function(next) {
  let total = 0;
  this.products.forEach(product => {
    total += product.quantity * product.productId.price; // Assuming Product has a price field
  });
  this.totalBillablePrice = total;
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
