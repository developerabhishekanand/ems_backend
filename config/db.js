// Use the promise wrapper!
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool;
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.CA
        ? { ca: process.env.CA } // PEM string from env
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   ssl: {
//     rejectUnauthorized: true,
//   },
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the MySQL database.");
// });

// db.query("SHOW TABLES;", (err, results) => {
//   if (err) {
//     console.error("Error fetching tables:", err);
//     return;
//   }
//   console.log("Tables in the database:", results);
// });
// export default db;
