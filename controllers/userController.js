const UserDB = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserDB.findOne({ where: { email } });

        if(existingUser){
            console.log("user exist in database");
            return res.status(500).send('User already exist..')
        }
        const saltround = 10;
            hashPassword = await bcrypt.hash(password , saltround) 
                
                await UserDB.create({ name, email, password : hashPassword});
                console.log("user created successfully.............");
                  res.status(200).json({ success: true, message: 'User created successfully' });
    }
    catch (err) {
        console.log('error : ', err);
        res.sendstatus(500);
    }
}

exports.getLogin = (req, res) => {

    res.sendFile('login.html', { root: './view' }); 
}


exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await UserDB.findOne({ where: { email } });
            if(!user){
                console.log('user does not exist....');
            res.sendstatus(401);

            }
        // Check if user exists and if password matches
        bcrypt.compare(password , user.password)
        .then(match => {
            if (match) {
                console.log('User logged in successfully.....');
                res.sendStatus(200);
            } else {
                console.log('Incorrect password');
                res.status(401).send('Incorrect password');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            res.sendStatus(500);
        });
       
    } catch (err) {
        console.log('Error: ', err);
        res.sendStatus(500);
    }
};