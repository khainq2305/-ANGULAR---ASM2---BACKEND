const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  is_feature: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image: DataTypes.STRING,
  idCategory: DataTypes.INTEGER,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finalPrice: DataTypes.DECIMAL(10, 2),
  deletedAt: DataTypes.DATE
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true // enable soft delete
});

module.exports = Product;
