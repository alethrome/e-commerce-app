const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./userModel');
const Product = require('./productModel');

const CartItem = sequelize.define('CartItem', {
    cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = CartItem;