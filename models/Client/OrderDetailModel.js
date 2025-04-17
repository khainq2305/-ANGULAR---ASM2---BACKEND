const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

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
const Product = require('./productModel');

// ⬇️ THÊM DƯỚI DÒNG `module.exports = OrderDetail;`
OrderDetail.belongsTo(Product, {
  foreignKey: 'idProduct',
  as: 'product'
});

module.exports = OrderDetail;
