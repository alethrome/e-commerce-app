const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('../models/userModel');

const filepath = path.join(__dirname, '../keys', 'private_key.pem');
const privateKey = fs.readFileSync(filepath, 'utf8');


async function loginUser(req, res, next) {
    try {
        const existingUser = await User.findOne({
            where: { username: req.body.username }
        });

        if(existingUser && existingUser.id) {
            const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password)

            if(isPasswordValid) {
                const userObject = {
                    userId: existingUser.id,
                    username: existingUser.username
                };

                const token = jwt.sign(userObject, privateKey, {
                    expiresIn: process.env.EXPIRY,
                    algorithm: 'RS256'
                });

                return res.status(200).json({
                    success: true,
                    message: 'Logged in sucessfully.',
                    accessToken: token
                }); 
            };

            return res.status(400).json({
                success: false,
                message: 'Login failed.'
            });
        };
    }
    catch(err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });        
    }
};

module.exports = { loginUser };