const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Failed to connect to MySQL database:", err);
  } else {
    console.log("Successfully connected to MySQL database.");
    connection.release();
  }
});

module.exports = db.promise();
