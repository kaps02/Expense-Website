const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/' , expenseController.expense );
router.post('/add' , expenseController.createExpense );
router.get('/get' , expenseController.getExpense );
router.delete('/delete/:id' , expenseController.deleteExpense );

module.exports = router;