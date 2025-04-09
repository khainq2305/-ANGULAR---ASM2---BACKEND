const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
<<<<<<< HEAD
const adminRoutes = require('./routes/Admin');

<<<<<<< HEAD

app.use(express.json())
=======
const path = require('path');
const adminRoutes = require('./routes/admin');

app.use(express.json());
>>>>>>> 7eb1bec ([ADMIN] Add user and comment management features for admin)

app.use(cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
=======
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
>>>>>>> 073180a ([Admin System] Add product management feature)
}));
app.use(express.json());
// ✅ Cần cái này để đọc FormData (trừ khi bạn dùng multer.diskStorage)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Nếu bạn lưu ảnh vào thư mục "public/uploads"
app.use('/uploads', express.static('public/uploads'));

<<<<<<< HEAD

<<<<<<< HEAD
app.use('/api/admin', adminRoutes);



=======
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));




app.use('/admin', adminRoutes);
>>>>>>> 7eb1bec ([ADMIN] Add user and comment management features for admin)

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
=======
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log('✅ Backend chạy tại: http://localhost:3000');
>>>>>>> 073180a ([Admin System] Add product management feature)
});
