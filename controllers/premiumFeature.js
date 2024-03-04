const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

exports.showLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();

        const userAggregateExpenses = {};

        // Aggregate expenses for each user
        expenses.forEach(expense => {
            console.log(expense);
            const userId = parseInt(expense.UserId); // Parse userId to integer
            const amount = parseInt(expense.amount); // Parse amount to integer
            if (userAggregateExpenses[userId]) {
                userAggregateExpenses[userId] += amount;
            } else {
                userAggregateExpenses[userId] = amount;
            }
        });
        
        console.log("......",userAggregateExpenses);

        // Create user leaderboard array
        const userLeaderBoard = users.map(user => ({
            name: user.name,
            amount: userAggregateExpenses[user.id] || 0
        }));

        // Sort the leaderboard array by amount (descending order)
        userLeaderBoard.sort((a, b) => b.amount - a.amount);

        console.log("User Leaderboard:", userLeaderBoard);

        res.status(200).json(userLeaderBoard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

