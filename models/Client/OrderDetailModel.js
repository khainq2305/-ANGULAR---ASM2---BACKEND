const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const Product = require('./ProductModel');

const OrderDetail = sequelize.define('OrderDetail', {
  idOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProduct: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  }
}, {
  tableName: 'order_details',
  timestamps: true
});

// Quan hệ với Product
OrderDetail.belongsTo(Product, {
  foreignKey: 'idProduct',
  as: 'product',
});

// Remove the belongsTo relationship with Order here

module.exports = OrderDetail;