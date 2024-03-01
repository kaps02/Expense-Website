const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');

const userRoute =  require('./routes/userRoute')
const expenseRoute = require('./routes/expenseRoute');
const User = require('./models/userModel');
const Expense = require('./models/expenseModel');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));


app.use('/user' , userRoute);
app.use('/expense' , expenseRoute);

  User.hasMany(Expense); 
  Expense.belongsTo(User);



// Sync database
sequelize.sync({force : false})
.then(() => {
    console.log('DB synced');
})
.catch(err => {
    console.error('Error syncing  database: ', err);
});

app.listen(5000 , ()=>{
    console.log('working on 5000.........');
})
