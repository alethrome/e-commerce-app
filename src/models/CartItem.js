'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CartItem.init({
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
          model: Model.User,
          key: 'id'
      }
  },
  product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
          model: Model.Product,
          key: 'id'
      }
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  }
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};