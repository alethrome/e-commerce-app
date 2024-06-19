const express = require('express');
const router = express.Router();

const { createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct } = require('../controllers/productController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.post('/create', upload.single('image'), createProduct);
router.get('/all', authenticateUser, getAllProducts);
router.get('/:productId', authenticateUser, getProductById);
router.put('/:productId', authenticateUser, updateProduct);
router.delete('/:productId', authenticateUser, deleteProduct);

module.exports = router;