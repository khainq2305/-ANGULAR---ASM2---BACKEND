const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // ✅ Không cho phép null
    },
    phone: {
      // ✅ Đảm bảo có cột phone
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 1 = Đang hoạt động, 0 = Đã khóa
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true }, // Ngày yêu cầu xóa
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // ✅ Bật xóa mềm
  }
);

module.exports = User;
