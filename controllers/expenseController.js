const ExpenseDB = require('../models/expenseModel');

exports.createExpense = async (req, res) => {
    const { category, description, amount } = req.body;
    try {
      await ExpenseDB.create({ category, description, amount });
      console.log('into create expense');
      res.sendStatus(201); // Created
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal Server Error
    }
  }

exports.getExpense = async (req, res) => {
    try {
      const expenses = await ExpenseDB.findAll();
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal Server Error
    }
  }

exports.expense = (req, res) => {

        // If the user is logged in, serve the expense page
       // res.sendFile(__dirname + '/view/expense.html');
    res.sendFile('expense.html', { root: './view' }); 
      
}

exports.deleteExpense = async(req ,res)=>{
    const id = req.params.id;
    try {
        // Delete the expense from the database
        await ExpenseDB.destroy({ where: { id } });
        res.sendStatus(200); // OK
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.sendStatus(500); // Internal Server Error
    }
    
}