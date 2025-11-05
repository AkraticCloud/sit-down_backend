// Establishes a connection to a PostgreSQL database
// We'll need this connection for storing user information in a structured format
 const {Client} = require('pg')

 require('dotenv').config()

 // Pulls from environment variables for required information
 const con = Client({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   port: process.env.DB_PORT,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME
 })

 module.exports = con