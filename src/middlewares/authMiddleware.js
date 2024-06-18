const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const filepath = path.join(__dirname, '../keys', 'public_key.pem');
const publicKey = fs.readFileSync(filepath, 'utf8');

async function authenticateUser(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader) {
            logger.warn('Access token is missing.');
            return res.status(401).json({
                success: false,
                message: 'Access token is missing'
            });
        }

        const token = authorizationHeader.split(' ')[1];

        const result = jwt.verify(token, publicKey, {
            algorithm: 'RS256'
        });

        req.user = result;

        next();
    } catch(err) {
        logger.error(`Authentication error: ${err.message}`);
        return res.status(400).json({
            success: false,
            message: err.message
        });        
    }
};

module.exports = { authenticateUser };