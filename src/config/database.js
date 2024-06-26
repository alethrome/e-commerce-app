const Sequelize = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

console.log(config);

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging
    }
);

module.exports = sequelize;