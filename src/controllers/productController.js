const Product = require('../models/productModel');
const logger = require('../config/logger');

async function createProduct(req, res) {
    try {
        const newProduct = await Product.create({
            ...req.body
        });
    
        return res.status(200).json({
            success: true,
            message: 'Product successfully created.',
            newProduct
        });
    } catch (err) {
        logger.error(`Error creating new product: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }  
};

async function getAllProducts(req, res) {
    try {
        const products = await Product.findAll();

        return res.status(200).json(products);
    } catch(err) {
        logger.error(`Error fetching products: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function getProductById(req, res) {
    try {
        const product = await Product.findByPk(req.params.productId);

        if(product === null) {
            logger.warn('Product not found.');

            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        return res.status(200).json(product);
    } catch(err) {
        logger.error(`Error fetching product: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function updateProduct(req, res) {
    try {
        const product = await Product.findByPk(req.params.productId);

        if(product) {
            const updatedProduct = await Product.update(
                { ...req.body },
                { where: { id: req.params.productId }, returning: true },
            );

            const productData = updatedProduct[1]
        
            return res.status(200).json({
                success: true,
                message: 'Product successfully updated.',
                productData
            });
        } else {
            logger.warn('Product not found.')
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }
        
    } catch (err) {
        logger.error(`Error creating new product: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }  
};

async function deleteProduct(req, res) {
    try {
        const product = await Product.findByPk(req.params.productId);

        if(product) {
            const deletedProduct = await Product.destroy({
                where: { id: product.id }
            });

            return res.status(200).json({
                success: true,
                message: 'Product successfully deleted.',
                deletedProduct
            });

        } else {
            logger.warn('Product not found.')
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            }); 
        }
    } catch(err) {
        logger.error(`Error creating new product: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
