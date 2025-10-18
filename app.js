const express = require ('express')
const cors = require ('cors')

require('dotenv').config()
const PORT = process.env.SERVER_PORT || 8000

const app = express()
app.use(express.json({limit: '10mb'})) //Arbitrary json size limit
app.use(cors())

// Allows access to the routes found in the routes folder
const routes = require('./routes')
app.use("/", routes)

//Starts server and informs what port to request to
app.listen(PORT, () =>{console.log(`Server is listening at port ${PORT}`)})