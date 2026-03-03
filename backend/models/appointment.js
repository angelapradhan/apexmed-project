const { DataTypes } = require('sequelize');

const { sequelize } = require('../database/db'); 

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctorId: { type: DataTypes.STRING, allowNull: false },
  doctorName: { type: DataTypes.STRING, allowNull: false },
  doctorImage: { type: DataTypes.STRING, allowNull: true },
  patientName: { type: DataTypes.STRING, allowNull: false },
  patientEmail: { type: DataTypes.STRING, allowNull: false },
  patientPhone: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  fee: { type: DataTypes.FLOAT, allowNull: false },

  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pending', 
    allowNull: false 
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

module.exports = Appointment;