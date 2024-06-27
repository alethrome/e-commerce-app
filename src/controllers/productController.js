const { unlink } = require('fs');
const { Product } = require('../models');
const logger = require('../config/logger');

async function createProduct(req, res) {
    const price = parseFloat(req.body.price);

    try {
        const newProduct = await Product.create({
            name: req.body.name,
            price,
            description: req.body.description,
            imageURL: req.file ? req.file.path : null
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

async function getAllProductsWithPagination(req, res) {
    try {
        const page = req.query.page || 1; 
        const rows = req.query.pageSize || 2; 

        const offset = (page - 1) * rows;

        const products = await Product.findAndCountAll({
            limit: rows,
            offset: offset,
            order: [['id', 'ASC']] 
        });

        const totalCount = products.count;
        const totalPages = Math.ceil(totalCount / pageSize); 
        const currentPage = page;

        return res.status(200).json({
            success: true,
            currentPage: currentPage,
            totalPages: totalPages,
            totalCount: totalCount,
            products: products.rows 
        });
    } catch (err) {
        console.error(`Error fetching products: ${err.message}`);
        return res.status(500).json({
            success: false,
            message: `Error fetching products: ${err.message}`
        });
    }
}

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
        const price = parseFloat(req.body.price);
        const product = await Product.findByPk(req.params.productId);

        if(product) {
            const updatedProduct = await Product.update(
                { 
                    name: req.body.name, 
                    description: req.body.description,
                    price: parseFloat(req.body.price), 
                    imageURL: req.file ? req.file.path : null 
                },
                { where: { id: req.params.productId }, returning: true },
            );

            if(req.file && product.imageURL != null) {
                unlink(product.imageURL, (err) => {
                    if (err) throw err;
                    console.log(`${product.imageURL} is deleted.`);
                });
            };

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

            if(product.imageURL != null ) {
                unlink(product.imageURL, (err) => {
                    if (err) throw err;
                    console.log(`${product.imageURL} is deleted.`);
                });   
            };

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
    deleteProduct,
    getAllProductsWithPagination
}
