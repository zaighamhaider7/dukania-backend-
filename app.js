const express = require('express');
const cors = require("cors");


const app = express();
app.use(cors());

app.use(express.json());


// auth routes
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth',authRoutes);

// store routes
const storeRoutes = require('./routes/storeRoutes');

app.use('/api/store',storeRoutes);

// products routes
const productRoutes = require('./routes/productRoutes');

app.use('/api/product',productRoutes);

// payment routes
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/payment',paymentRoutes);

module.exports = app;                                                                   