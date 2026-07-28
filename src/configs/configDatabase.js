import mysql from "mysql2/promise";

// config connect database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "jwt_react_node",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;