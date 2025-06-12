const path = require('path');
const env = process.env.NODE_ENV || 'dev';
require('dotenv').config({path: path.resolve(__dirname, `../../.env.${env}`)});

module.exports = {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
    operatorsAliases: 0,
    logging: console.log,
    dialectOptions: {
        ssl: false
            
    }
};
