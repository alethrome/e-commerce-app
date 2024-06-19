const express = require('express');
const router = express.Router();

const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.post('/', authenticateUser, createOrder);
router.get('/list', authenticateUser, getOrders);
router.get('/:orderId', authenticateUser, getOrderById);

module.exports = router;