const { DataTypes } = require("sequelize");
const sequelize = require("../../database");
const Category = require("../../models/Admin/categoryModel");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    is_feature: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idCategory: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    paranoid: true, 
    deletedAt: "deletedAt", 
  }
);


Product.belongsTo(Category, { foreignKey: "idCategory", as: "category" });

module.exports = Product;
