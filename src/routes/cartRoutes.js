const express = require('express');
const router = express.Router();

const {
    createCartItem,
    getCartItems,
    updateItemQuantity,
    removeCartItem
} = require('../controllers/cartItemController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.post('/insert', authenticateUser, createCartItem);
router.get('/all', authenticateUser, getCartItems);
router.put('/:itemId', authenticateUser, updateItemQuantity);
router.delete('/delete/:itemId', authenticateUser, removeCartItem);

module.exports = router;