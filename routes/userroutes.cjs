//Router module for user actions

const con = require('../db/client.cjs')
const express = require('express')
const router = express.Router()

router.post('/create', async(req, res)=>{
   try{

   } catch{res.status(500).send("Internal Error: Error occurred while creating account")}
})

router.get('/login', async(res,req)=> {
   try{

   } catch{res.statusCode(500).send("Internal Error: Error occured during login")}
})

router.put('/update', async(req,res)=> {
   try{

   }catch{res.status(500).send("Internal Error: Error occurred while updating account information")}
})

module.exports = router