import mysql from "mysql";
export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Athish123",
    database:"social"
})