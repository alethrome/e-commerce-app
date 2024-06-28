const express = require('express');
const router = express.Router();

const { createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    getAllProductsWithPagination} = require('../controllers/productController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

router.post('/create', authenticateUser, upload.single('image'), createProduct);
router.get('/all', authenticateUser, getAllProducts);
router.get('/:productId', authenticateUser, getProductById);
router.patch('/:productId', authenticateUser, upload.single('image'), updateProduct);
router.delete('/:productId', authenticateUser, deleteProduct);

//router.get('/all/test', getAllProductsWithPagination);

module.exports = router;