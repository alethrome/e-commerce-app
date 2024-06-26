const sequelize = require('../config/database');
const logger = require('../config/logger');
const { Order, OrderItem, Product } = require('../models');

async function createOrder(req, res) {
    const { products } = req.body
    let totalPrice = 0;

    let transaction;

    try {
        transaction = await sequelize.transaction();    

        for(const cartItem of products) {
            const product = await Product.findOne({
                where: { id: cartItem.product_id }
            });

            const itemPrice = cartItem.quantity * product.price;

            totalPrice += itemPrice;
        };

        const order = await Order.create({
            user_id: req.user.userId,
            total_amount: totalPrice
        }, { transaction });

        for(const product of products) {
            await OrderItem.create({
                order_id: order.order_id,
                product_id: product.product_id,
                quantity: product.quantity,
                price: parseFloat(product.price)
            }, { transaction });
        };

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'Order is successfully placed.',
            order
        });
    } catch(err) {
        await transaction.rollback();

        logger.error(`Error creating new order: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function getOrders(req, res) {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.userId }
        });

        const orderItems = await OrderItem.findAll({
            where: { order_id: orders.map(order => order.order_id) }
        });

        const ordersWithProductItems = orders.map(order => ({
            order_id: order.order_id,
            user_id: order.user_id,
            total_amount: order.total_amount,
            products: orderItems.filter(item => item.order_id === order.order_id)
        }));

        return res.status(200).json({   
            Orders: ordersWithProductItems   
        });
    } catch(err) {
        logger.error(`Error fetching orders: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function getOrderById(req, res) {
    try {
        const userOrder = await Order.findOne({
            where: { 
                user_id: req.user.userId,
                order_id: req.params.orderId
            }
        });

        if(!userOrder) {
            logger.warn('Order not found.');

            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        };

        const productOrders = await OrderItem.findAll({
            where: { order_id: userOrder.order_id }
        });

        const orderWithProductItems = {
            Order: userOrder,
            Products: productOrders
        };

        return res.status(200).json(orderWithProductItems);
    } catch(err) {
        logger.error(`Error fetching order: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

async function updateOrderStatus(req, res) {
    try {
        const order = await Order.findByPk(req.params.orderId);

        if(order) {
            const updatedOrder = await Order.update(
                { status: req.body.status },
                { where: { order_id: req.params.orderId }, returning: true}
            );

            return res.status(200).json({
                success: true,
                message: 'Order status is successfully updated.',
                updatedOrder
            });
        }
    } catch(err) {
        logger.error(`Error fetching order: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

async function payOrder(req, res) {
    try {
        const { card_holder, card_number, exp_date, cvv } = req.body;

        const order = await Order.findOne({
            where: { 
                order_id: req.params.orderId,
                user_id: req.user.userId
            }
        });
    
        if(!order) {
            logger.warn('Order not found.');
    
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        };
    
        if(!card_holder || !card_number || !exp_date || !cvv ) {
            logger.warn('Missing required fields.');
    
            return res.status(400).json({
                success: false,
                message: 'Missing required fields.'
            });
        };
    
        const updatedOrder = await Order.update(
            { status: 'paid' },
            { where: { order_id: req.params.orderId }, returning: true }
        );
    
        return res.status(200).json({
            success: true,
            message: `Order number ${req.params.orderId} is paid`,
            updatedOrder
        });
    } catch(err) {
        logger.error(`Error fetching order: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }  
};

module.exports = { 
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    payOrder
};