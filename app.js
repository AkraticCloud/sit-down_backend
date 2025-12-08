require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const supabase = require('./db/client.cjs')
const cors = require('cors')
const express = require('express')

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

//Starts server and informs what port to request to
app.listen(PORT, () =>{console.log(`Server is listening at port ${PORT}`)})