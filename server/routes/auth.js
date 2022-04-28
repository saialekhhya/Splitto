const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
    try {
        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        });


        // Save user to database
        await newUser.save();
        res.status(200).json(newUser);
    }
    catch (err) {
        res.send("error: " + err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Invalid password");

        res.status(200).json(user);
    }
    catch (err) {
        res.send("error: " + err);
    }
});

module.exports = router;