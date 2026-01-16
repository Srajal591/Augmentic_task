const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { sendSuccess, sendError } = require('../utils/response');

// Place a new order - CONCURRENCY SAFE with atomic operations
exports.placeOrder = async (req, res) => {
  const io = req.app.get('io');
  try {
    const { productId, quantity, staffName } = req.body;

    // Validate input
    if (!productId || !quantity || !staffName) {
      return sendError(res, 'All fields are required', 400);
    }

    // Check if quantity is valid
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return sendError(res, 'Quantity must be a positive integer', 400);
    }

    // Find product first to get name
    const product = await Product.findById(productId);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // ATOMIC OPERATION: Update stock only if sufficient stock exists
    // This prevents race conditions with concurrent orders
    const updatedProduct = await Product.findOneAndUpdate(
      { 
        _id: productId,
        availableStock: { $gte: quantity } // Only update if we have enough stock
      },
      {
        $inc: { availableStock: -quantity } // Atomic decrement
      },
      {
        new: true,
        runValidators: false
      }
    );

    // If updatedProduct is null, it means we didn't have enough stock
    if (!updatedProduct) {
      return sendError(
        res,
        `Insufficient stock. Available: ${product.availableStock}, Requested: ${quantity}`,
        400
      );
    }

    // Create order with confirmed status since we already deducted stock
    const order = await Order.create({
      productId,
      productName: product.name,
      quantity,
      staffName,
      status: 'confirmed'
    });

    // Broadcast stock update to all connected clients
    if (io) {
      io.to('inventory').emit('stock-updated', {
        productId: productId.toString(),
        productName: product.name,
        availableStock: updatedProduct.availableStock,
        timestamp: new Date(),
      });
    }

    return sendSuccess(res, 'Order placed successfully', {
      orderId: order._id,
      productName: order.productName,
      quantity: order.quantity,
      availableStock: updatedProduct.availableStock,
    }, 201);
  } catch (error) {
    console.error('Order error:', error.message);
    return sendError(res, 'Error placing order: ' + error.message, 500);
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderedAt: -1 });
    return sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (error) {
    return sendError(res, 'Error fetching orders: ' + error.message, 500);
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }
    return sendSuccess(res, 'Order fetched successfully', order);
  } catch (error) {
    return sendError(res, 'Error fetching order: ' + error.message, 500);
  }
};

// Cancel order and restore stock
exports.cancelOrder = async (req, res) => {
  const io = req.app.get('io');
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.status === 'cancelled') {
      return sendError(res, 'Order is already cancelled', 400);
    }

    // ATOMIC OPERATION: Restore stock
    const product = await Product.findByIdAndUpdate(
      order.productId,
      {
        $inc: { availableStock: order.quantity }
      },
      { new: true }
    );

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Broadcast stock update
    if (io) {
      io.to('inventory').emit('stock-updated', {
        productId: order.productId.toString(),
        productName: order.productName,
        availableStock: product.availableStock,
        timestamp: new Date(),
      });
    }

    return sendSuccess(res, 'Order cancelled successfully', {
      orderId: order._id,
      availableStock: product.availableStock
    });
  } catch (error) {
    return sendError(res, 'Error cancelling order: ' + error.message, 500);
  }
};
