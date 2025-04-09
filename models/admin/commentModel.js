const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Comment = sequelize.define('Comment', {
  idComment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_spam: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'comments',
  timestamps: true
});

module.exports = Comment;
