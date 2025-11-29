import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
  console.log()
});

db.query("SHOW TABLES;", (err, results) => {
  if (err) {
    console.error('Error fetching tables:', err);
    return;
  }
  console.log('Tables in the database:', results);
});
export default db;