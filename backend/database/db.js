const { Sequelize } = require("sequelize");
require("dotenv").config();


// Initialize Sequelize 
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, 
    port: process.env.DB_PORT || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
    await sequelize.sync({ alter: true }); 
    console.log("Database models synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; 
  }
};

module.exports = { sequelize, connectDB };