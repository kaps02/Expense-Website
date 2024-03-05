const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const path = require('path');
const sequelize = require('../config/database');

exports.createExpense = async (req, res) => {
  const { category, description, amount } = req.body;
  try {
    const ExpenseAmount = Number(req.user.totalExpense) + Number(amount)  ;
    //console.log(req.user.id);
    await Expense.create({ category, description, amount, UserId: req.user.id  });
    console.log('Expense created with id.....' , { category, description, amount, UserId: req.user.id});
    await User.update({ totalExpense: ExpenseAmount }, { where: { id: req.user.id } });

    res.status(201).json({ success: true, message: "Expense added in table." }); // Created
  } catch (error) {
    console.error('Error creating expense:', error);
    res.sendStatus(500); // Internal Server Error
  }
};


exports.getExpense = async (req, res) => {
    
  try {
    const expenses = await Expense.findAll({where: {UserId : req.user.id}});
    // Read the HTML file and send it as the response
    res.send(expenses)
  } catch (error) {
    console.error("error in getexpense" , error);
    res.sendStatus(500); // Internal Server Error
  }
  }

exports.expense = (req, res) => {

        // If the user is logged in, serve the expense page
       // res.sendFile(__dirname + '/view/expense.html');
  res.sendFile('expense.html', { root: './view' }); 
      
}
/*
exports.deleteExpenses= async(req ,res)=>{
  const userId = req.user.UserId;
    const id = req.params.id;
    try {
        // Delete the expense from the database
        await Expense.destroy({ where: { id } });
        res.sendStatus(200); // OK
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.sendStatus(500); // Internal Server Error
    }
    
}*/

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  let transaction;

  try {
    transaction = await sequelize.transaction();

    const expense = await Expense.findByPk(id, { transaction });
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.UserId !== userId) {
      await transaction.rollback();
      return res.status(403).json({ error: "You are not authorized to delete this expense" });
    }

    const ExpenseAmount = Number(req.user.totalExpense) - Number(expense.dataValues.amount);

    await User.update({ totalExpense: ExpenseAmount }, { where: { id: req.user.id }, transaction });
    await Expense.destroy({ where: { id }, transaction });

    await transaction.commit();

    res.sendStatus(200); // OK
  } catch (error) {
    console.error('Error deleting expense:', error);
    if (transaction) await transaction.rollback();
    res.sendStatus(500); // Internal Server Error
  }
}
