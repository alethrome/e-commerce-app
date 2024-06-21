const Sequelize = require("sequelize");
const dotenv = require('dotenv');
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

dotenv.config();

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect
    }
);

module.exports = sequelize;