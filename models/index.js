const Order = require("./Admin/orderModel");
const OrderDetail = require("./admin/orderDetailModel");
const Product = require("./Admin/productModel");
const User = require("./Admin/userModel");
const CheckoutAddress = require("./Admin/checkoutAddressModel");

// 👉 Quan hệ ở đây để tránh vòng lặp
Order.hasMany(OrderDetail, { foreignKey: "idOrder", as: "orderDetails" });
Order.belongsTo(User, { foreignKey: "idUser", as: "customer" });
Order.belongsTo(CheckoutAddress, { foreignKey: "checkout_address_id", as: "shippingAddress" });

OrderDetail.belongsTo(Order, { foreignKey: "idOrder", as: "order" });
OrderDetail.belongsTo(Product, { foreignKey: "idProduct", as: "product" });
Product.hasMany(OrderDetail, { foreignKey: "idProduct", as: "orderDetails" });

module.exports = {
  Order,
  OrderDetail,
  Product,
  User,
  CheckoutAddress,
};
