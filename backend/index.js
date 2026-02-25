const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./database/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

//admin
const adminRoutes = require('./routes/adminRoutes'); // Naya import

// --- MODELS IMPORT (YO GARNAU PARCHHA SYNC KO LAGI) ---
require('./models/user');
require('./models/appointment');
require('./models/services'); // <--- Yo model load bhayepachhi matra database ma table bancha

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your React port
    credentials: true
}));

// Routes
app.use('/api/user', userRoutes);

//admin
app.use('/api/admin', adminRoutes); // Admin ko lagi xuttai prefix

app.use('/api/service', serviceRoutes);

// Set Port to 3000
const PORT = 3000;

// Start Server First to prevent "Clean Exit"
app.listen(PORT, () => {
    console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
    
    // Then connect to the Database
    connectDB().then(() => {
        sequelize.sync({ force: false }).then(() => {
            console.log("✅ Database Synced");
        });
    }).catch(err => {
        console.error("❌ DB Connection Error: ", err.message);
    });
});