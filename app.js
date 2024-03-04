const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');

const userRoute =  require('./routes/userRoute')
const expenseRoute = require('./routes/expenseRoute');
const paymentRoute = require('./routes/paymentRoute');
const premiumRoute = require('./routes/premiumFeature');

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/orderModel');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));


app.use('/user' , userRoute);
app.use('/expense' , expenseRoute);
app.use('/payment' , paymentRoute);
app.use('/premium' , premiumRoute);



  User.hasMany(Expense); 
  Expense.belongsTo(User);

  User.hasMany(Order); 
  Order.belongsTo(User);


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
