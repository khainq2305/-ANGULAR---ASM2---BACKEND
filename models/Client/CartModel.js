const { DataTypes } = require("sequelize");
const sequelize = require("../../database");
const Product = require("./ProductModel"); // ✅ import đúng đường dẫn
const Cart = sequelize.define("Cart", {
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
}, {
  tableName: "cart",
  timestamps: true
});
Cart.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product' // 👈 tên alias trùng với chỗ include ở trên
  });
module.exports = Cart;
