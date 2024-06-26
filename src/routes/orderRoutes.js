const express = require('express');
const router = express.Router();

const { createOrder, getOrders, getOrderById, payOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.post('/', authenticateUser, createOrder);
router.get('/list', authenticateUser, getOrders);
router.get('/:orderId', authenticateUser, getOrderById);
router.patch('/update-status/:orderId', authenticateUser, updateOrderStatus);
router.patch('/pay/:orderId', authenticateUser, payOrder);

module.exports = router;