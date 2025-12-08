// Establishes a connection to a PostgreSQL database
// We'll need this connection for storing user information in a structured format
 const { createClient } = require('@supabase/supabase-js')

 require('dotenv').config()

 // Pulls from environment variables for required information
 const url = process.env.SUPABASE_URL
 const key = process.env.SUPABASE_PUBLISHABLE_KEY

 if (url == null) {
    console.error("Missing connection string, exiting...")
    process.exit(1)
 }

 const supabase = createClient({ url, key })
 
 module.exports = supabase