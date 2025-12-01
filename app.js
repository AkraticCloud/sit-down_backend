const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const con = require('./db/client.cjs')
const cors = require('cors')
const express = require('express')
const supabase = require('./utility/supabase.js')

require('dotenv').config()
const app = express()
const PORT = process.env.SERVER_PORT || 8000


const corsOptions = {
   origin: process.env.ACCEPTED_ORIGIN, 
   credentials: true,
   methods: ['GET','POST','PATCH','PUT','DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({limit: '10mb'})) //Arbitrary json size limit

// Allows access to the routes found in the routes folder
const routes = require('./routes/index.cjs')
app.use("/", routes)

//Establish connection to client
con.connect()
   .then(() => console.log("Connection established with database"))
   .catch(err => console.error('Connection Error: ', err.stack))

//Starts server and informs what port to request to
app.listen(PORT, () =>{console.log(`Server is listening at port ${PORT}`)})