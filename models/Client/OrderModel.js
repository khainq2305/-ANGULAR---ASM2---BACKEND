const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Order = sequelize.define(
  "Order",
  {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkout_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    shipping_method: DataTypes.STRING,
    total_price: DataTypes.BIGINT,
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    cancel_reason: DataTypes.TEXT,
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    order_code: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ CHỈ sửa dòng này
      unique: true
    }    
,    
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);
Order.hasMany(require('./OrderDetailModel'), {
  as: 'orderDetails',
  foreignKey: 'idOrder'
});

module.exports = Order;
