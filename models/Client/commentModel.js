const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Comment = sequelize.define("Comment", {
  idComment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  is_spam: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "comments",
  timestamps: true
});

module.exports = Comment;
