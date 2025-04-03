const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;
const adminRoutes = require('./routes/Admin');


app.use(express.json())

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));


app.use('/api/admin', adminRoutes);




app.listen(port, () => {
    console.log('http://localhost:3000');
})