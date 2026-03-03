const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db'); 
const Doctor = require('./services'); 
const Hospital = require('./hospital_model'); 

const Favorite = sequelize.define('Favorite', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: true }, 
    hospitalId: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'doctor' }
}, { tableName: 'favorites', timestamps: true });


Favorite.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctorDetails' });
Favorite.belongsTo(Hospital, { foreignKey: 'hospitalId', as: 'hospitalDetails' });

module.exports = Favorite;