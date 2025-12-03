import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "novaconstruye",
  port: 3306,
  connectionLimit: 5
});

export default pool;
