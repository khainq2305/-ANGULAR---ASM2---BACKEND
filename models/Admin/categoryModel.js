const connection = require('../../database');
const { DataTypes } = require('sequelize');

const Category = connection.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
}, {
    tableName: 'categories',
    timestamps: true,
    paranoid: true // Nếu bạn muốn Sequelize tự xử lý deletedAt khi xóa mềm
});

module.exports = Category;
