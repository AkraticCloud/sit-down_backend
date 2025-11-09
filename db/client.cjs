// Establishes a connection to a PostgreSQL database
// We'll need this connection for storing user information in a structured format
 const {Client} = require('pg')

 require('dotenv').config()

 // Pulls from environment variables for required information
 const url = process.env.DB_URL
 if (url == null) {
    console.error("Missing connection string, exiting...")
    process.exit(1)
 }

 const con = new Client({
  connectionString: url
 })
 
 module.exports = con