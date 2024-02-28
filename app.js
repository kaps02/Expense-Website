const express = require('express');
const sequelize = require('./models/userModel');
const bodyParser = require('body-parser');
const path = require('path');

const userRoute =  require('./routes/userRoute')
const expenseRoute = require('./routes/expenseRoute');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));


app.use('/user' , userRoute);
app.use('/expense' , expenseRoute);


// Sync database
sequelize.sync().then(() => {
    console.log('DB synced');
}).catch(err => {
    console.error('Error syncing  database: ', err);
});

app.listen(1000 , ()=>{
    console.log('working on 1000.........');
})
