// models/ExpenseModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')

// Define the Expense model
const ExpenseDB = sequelize.define('ExpenseDB', {
        category: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        amount: {
          type: DataTypes.STRING, 
          allowNull: false
        }
      });
      
// Sync the model with the database
sequelize.sync();

// Export the Expense model
module.exports = ExpenseDB;
