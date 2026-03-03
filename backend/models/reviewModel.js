const { sequelize } = require('../database/db'); 
const { DataTypes } = require('sequelize');
const Doctor = require('./services')
const User = require('./user');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  doctorId: {                
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Doctor,
        key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
}, {
  tableName: 'doctor_reviews',
  timestamps: true,
});


Review.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(Review, { foreignKey: 'doctorId' });


Review.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Review, { foreignKey: 'userId' });

module.exports = Review;