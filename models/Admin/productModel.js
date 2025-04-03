const connection = require('../../database');
const { DataTypes } = require('sequelize');

const ProductModel = connection.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = ProductModel;
