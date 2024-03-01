const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate JWT token
function generateToken(id) {
    const payload = { userId: id };
    const secretKey = 'secretkey';
    return jwt.sign(payload, secretKey); // Signing the token with the payload and secret key
}

// Controller for user signup
exports.postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user with the given email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log("User already exists in the database");
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({ name, email, password: hashedPassword });
        console.log("User created successfully");
        res.status(200).json({ success: true, message: 'User created successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Controller for rendering login page
exports.getLogin = (req, res) => {
    res.sendFile('login.html', { root: './view' }); 
}

// Controller for user login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User does not exist');
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // Generate token and send it in response
            const token = generateToken(user.id);
            console.log("Login successful");
            res.status(200).json({ success: true, message: "User logged in successfully", token });
        } else {
            console.log('Incorrect password');
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
