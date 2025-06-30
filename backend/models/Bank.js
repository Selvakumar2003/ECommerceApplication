const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bank = sequelize.define('Bank', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountNumber: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ifscCode: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'banks',
  timestamps: true
});

module.exports = Bank;