const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 36
    },
    doctorImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.STRING,
        defaultValue: "4.8"
    },
    patients: {
        type: DataTypes.STRING,
        defaultValue: "1500+"
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Male"
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    medicalLicense: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    availableTime: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Service;