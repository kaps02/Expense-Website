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