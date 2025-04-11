require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Đổi thành thư mục admin chuẩn
const adminRoutes = require('./routes/Admin');
const clientRoutes = require('./routes/Client')
// Đọc JSON
app.use(express.json());

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:4200', // cho phép Angular gọi
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Đọc FormData (khi gửi ảnh, file, v.v.)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Truy cập ảnh tĩnh
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Route chính
app.use('/admin', adminRoutes);
app.use('/', clientRoutes)
// Lắng nghe server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
