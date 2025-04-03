const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;
const categoryRoutes = require('./routes/categoryRoutes');
app.use(express.json())

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(categoryRoutes);

app.listen(port, () => {
    console.log('http://localhost:3000');
})