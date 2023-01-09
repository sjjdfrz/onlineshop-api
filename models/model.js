const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sajjad#farzaneh1',
    database: 'mydb1',
    multipleStatements: true
});

connection.connect();

module.exports = connection;