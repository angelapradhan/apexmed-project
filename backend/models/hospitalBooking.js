const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db'); 

const HospitalBooking = sequelize.define('HospitalBooking', {
  hospitalId: { type: DataTypes.STRING, allowNull: false },
  hospitalName: { type: DataTypes.STRING, allowNull: false },
  
  coverImage: { type: DataTypes.STRING, allowNull: true },

  patientName: { type: DataTypes.STRING, allowNull: false },
  patientEmail: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  fee: { type: DataTypes.STRING },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pending', 
    allowNull: false 
  }
}, {
  tableName: 'hospital_bookings',
  timestamps: false
});

module.exports = HospitalBooking;