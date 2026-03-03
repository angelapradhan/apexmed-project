const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Hospital = sequelize.define('Hospital', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hospitalName: { type: DataTypes.STRING, allowNull: false },
    hospitalType: { type: DataTypes.STRING, allowNull: false },
    establishedYear: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    emergencyPhone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    departments: { type: DataTypes.TEXT }, 
    feeRange: { type: DataTypes.STRING },
    emergency247: { type: DataTypes.STRING, defaultValue: "Yes" },
    icuAvailable: { type: DataTypes.STRING, defaultValue: "Yes" },
    hospitalLogo: { type: DataTypes.STRING, allowNull: false },
    coverImage: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Hospital;