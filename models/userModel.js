// models/ExpenseModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')

// Define the Expense model
const UserDB = sequelize.define('UserDB', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING, 
          allowNull: false
        }
      });
      
// Sync the model with the database
sequelize.sync();

// Export the Expense model
module.exports = UserDB;
