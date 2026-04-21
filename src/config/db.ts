import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db : any= mysql.createPool({
    host : process.env.DB_HOST || "",
    user:process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    password:process.env.DB_PASSWORD || "",
    dateStrings:true
});

db.getConnection((err : any)=>{
 if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected.");
  }
})

export default db;