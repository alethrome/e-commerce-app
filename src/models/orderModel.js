const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Order;