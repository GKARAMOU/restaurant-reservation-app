const mysql = require('mysql2/promise'); // Υποστήριξη async/await

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurant_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = db;
