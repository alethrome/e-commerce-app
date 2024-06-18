const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const logger = require('../config/logger');

async function registerUser(req, res, next) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userData = await User.create({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });

        return res.status(200).json({
            success: true,
            message: 'User successfully registered.',
            userData
        });
    }
    catch(err) {
        logger.error(`Error creating new user: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    } 
};

async function getUsers(req, res) {
    try {
        const users = await User.findAll();

        return res.status(200).json(users);
    }
    catch(err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
module.exports = { registerUser, getUsers };