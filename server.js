const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
<<<<<<< HEAD
const adminRoutes = require('./routes/Admin');


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
}));

<<<<<<< HEAD

app.use('/api/admin', adminRoutes);



=======
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));




app.use('/admin', adminRoutes);
>>>>>>> 7eb1bec ([ADMIN] Add user and comment management features for admin)

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
