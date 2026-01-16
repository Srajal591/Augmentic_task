const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

// Order routes
router.post('/', orderController.placeOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
