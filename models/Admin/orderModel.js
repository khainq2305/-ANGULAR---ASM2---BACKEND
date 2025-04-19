const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   
    checkout_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "COD",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cancel_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
    
  },
  {
    tableName: "orders",
    timestamps: true,

  }
);

module.exports = Order;
