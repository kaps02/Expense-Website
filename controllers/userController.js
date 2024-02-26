const UserDB = require('../models/userModel');

exports.postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserDB.findOne({ where: { email } });

        if(existingUser){
            console.log("user exist in database");
            return res.status(500).send('User already exist..')
        }

            await UserDB.create({
                name,
                email,
                password
            });
            console.log("user created successfully");
            res.sendStatus(200);

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

        // Check if user exists and if password matches
        if (user && user.password === password) {
            console.log("Login successful");
            res.sendStatus(200);
        } else {
            console.log("Invalid email or password");
            res.status(401).send("Invalid email or password");
        }
    } catch (err) {
        console.log('Error: ', err);
        res.sendStatus(500);
    }
};