const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with credentials from your .env file
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Set to console.log to see SQL queries in terminal
    port: process.env.DB_PORT || 5432,
  }
);

/**
 * Function to authenticate the database connection.
 * It is marked 'async' so it can be awaited in index.js.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // This 'throw' is critical for the catch block in index.js
  }
};

module.exports = { sequelize, connectDB };