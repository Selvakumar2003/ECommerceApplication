const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommercee', 'root', 'selva1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Create database if it doesn't exist
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };