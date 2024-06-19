const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Product = require('./productModel.js');
const Order = require('./orderModel.js');

const OrderItem = sequelize.define('OrderItem', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {
            model: Order,
            key: 'order_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = OrderItem;