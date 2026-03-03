const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./database/db');
const path = require('path'); 

// routes import
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/booking');
const hospitalRoutes = require('./routes/hospital_routes');

// Admin and specific routes
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const hospitalBookingRoutes = require('./routes/hospitalBookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// models
require('./models/user');
require('./models/appointment');
require('./models/services'); 
require('./models/hospital_model');
require('./models/reviewModel');
require('./models/notification');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));

// static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// use routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api', bookingRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', hospitalBookingRoutes);
app.use('/api/notifications', notificationRoutes);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
    
    connectDB().then(() => {

        sequelize.sync({ force: false }).then(() => {
            console.log("✅ Database Synced");
        });
    }).catch(err => {
        console.error("❌ DB Connection Error: ", err.message);
    });
});