const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, authorize('seller', 'admin'), getAllOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/status', protect, authorize('seller', 'admin', 'customer'), updateOrderStatus);
router.delete('/:orderId', protect, authorize('admin'), deleteOrder);

module.exports = router;
