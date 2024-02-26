const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const userRoute =  require('./routes/userRoute')

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname , 'view')));
//app.use('/' , userRoute);

app.listen(1000 , ()=>{
    console.log('working on 1000.........');
})
