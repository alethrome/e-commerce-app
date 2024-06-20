const CartItem = require('../models/cartItemModel');
const logger = require('../config/logger');

async function createCartItem(req, res) {
    try {
        const [item, created] = await CartItem.findOrCreate({
            where: { product_id: req.body.product_id },
            defaults : {
                product_id: req.body.product_id,
                user_id: req.user.userId,
                quantity: req.body.quantity
            }
        });

        if(!created) {
            const total = req.body.quantity + item.quantity;

            const itemData = await CartItem.update({ 
                quantity: total
            }, {
                where: 
                    { cart_id: item.cart_id },
                    returning: true
            });

            return res.status(200).json({
                success: true,
                message: 'Product quantity successfully updated.',
                itemData: itemData[1]
            });
        };

        return res.status(200).json({
            success: true,
            message: 'Product successfully added to cart.',
            created: item
        });
    } catch(err) {
        logger.error(`Error adding item to cart: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function getCartItems(req, res) {
    try {
        const cartItems = await CartItem.findAll({
            where: { user_id: req.user.userId }
        });

        return res.status(200).json(cartItems);
    } catch(err) {
        logger.error(`Error fetching cart items: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function updateItemQuantity(req, res) {
    try {
        const updatedItem = await CartItem.update(
            { quantity: req.body.quantity },
            { where: { 
                cart_id: req.params.itemId,
                user_id: req.user.userId
            }, returning: true }
        );

        if(updatedItem[0] === 0) {
            logger.warn('Cart item not found.');
            return res.status(404).json({
                success: false,
                message: 'Cart item not found.'
            });  
        };

        return res.status(200).json({
            success: true,
            message: 'Quantity is updated.',
            updatedItem: updatedItem[1]
        });
    } catch(err) {
        logger.error(`Error updating quantity: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function removeCartItem(req, res) {
    try {
        const cartItem = await CartItem.findOne({
            where: { 
                cart_id: req.params.itemId,
                user_id: req.user.userId
            }
        });

        if (cartItem) {
            await CartItem.destroy({
                where: { cart_id: cartItem.cart_id }
            });

            return res.status(200).json({
                success: true,
                message: 'Item successfully removed from cart.',
                removedItem: cartItem
            });
        } else {
            logger.warn('Item not found.')
            return res.status(404).json({
                success: false,
                message: 'Item not found.'
            }); 
        }
    } catch(err) {
        logger.error(`Error removing item: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createCartItem,
    getCartItems,
    updateItemQuantity,
    removeCartItem
}