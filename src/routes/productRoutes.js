const express = require('express');
const router = express.Router();

const { createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct } = require('../controllers/productController');

router.post('/create', createProduct);
router.get('/all', getAllProducts);
router.get('/:productId', getProductById);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;