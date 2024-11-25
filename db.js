const mysql = require('mysql2');

const pool = mysql.createPool({
   host: '127.0.0.1',
   user: 'nodecode',
   password: 'PiARrrrXLQRM0fWzEOhv',
   database: 'nodedb',
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
 });

 pool.getConnection((err, connection) => {
   if (err) {
     console.error('Error connecting to the database:', err);
     return;
   }
   console.log('Successfully connected to the database');
   connection.release();
 });

 const promisePool = pool.promise();

 module.exports = promisePool;