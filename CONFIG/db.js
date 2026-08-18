const mysql = require('mysql2/promise');

const conectarDB = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'farmacia',
    port: 3307 // <--- Agregamos el puerto correcto de XAMPP
  });
};

module.exports = conectarDB;