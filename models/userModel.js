// models/ExpenseModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')

// Define the Expense model
const User = sequelize.define('User', {
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
      }, {
        freezeTableName: true // Set freezeTableName option to true
    });
      
// Sync the model with the database
//sequelize.sync();

// Export the Expense model
module.exports = User;
