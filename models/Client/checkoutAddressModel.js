const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const CheckoutAddress = sequelize.define(
  "CheckoutAddress",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    province_name: {
      // ✅ Đổi từ province_id sang province_name
      type: DataTypes.STRING,
      allowNull: false,
    },
    district_name: {
      // ✅ Đổi từ district_id sang district_name
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward_name: {
      // ✅ Đổi từ ward_id sang ward_name
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "checkout_address",
  }
);

module.exports = CheckoutAddress;
