import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()
const pool = mysql.createPool({
    host: process.env.HOST_NAME,
    user: process.env.HOST_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:Number(process.env.HOST_PORT)
})
const database=pool.promise()
export default database