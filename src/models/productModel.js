const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const CartItem = require('./cartItemModel.js');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Product.hasMany(CartItem, {
    onDelete: 'CASCADE',
    foreignKey: 'product_id'
});

module.exports = Product;