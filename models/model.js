const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    multipleStatements: true
});

connection.connect();

module.exports = connection;