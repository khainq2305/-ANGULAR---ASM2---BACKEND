require('dotenv').config();
console.log("ENV TEST:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT
});
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('Kết nối MySQL thành công!'))
  .catch(err => console.error('Lỗi kết nối:', err));

module.exports = sequelize;