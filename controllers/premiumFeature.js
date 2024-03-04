const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../config/database');
//const { expense } = require('../models/expenseModel');
exports.showLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name']
        });
        const userAggregateExpenses = await Expense.findAll({
            attributes: [
                'UserId',
                [sequelize.fn('sum', sequelize.col('amount')), 'total_cost'] // Aggregate the 'amount' column
            ],
            group: ['UserId']
        });
        
        const storeData = [];
users.forEach(user => {
    const userAggregateExpense = userAggregateExpenses.find(expense => expense.UserId === user.id);
    const total_cost = userAggregateExpense ? userAggregateExpense.dataValues.total_cost : 0;
    storeData.push({ name: user.name, total_cost: total_cost });
});
console.log(storeData);

        storeData.sort((a, b) => b.totalCost - a.totalCost); // Sort by totalCost

        res.status(200).json(storeData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

