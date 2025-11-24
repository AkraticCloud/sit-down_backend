//Router module for user actions

import { createClient } from '@supabase/supabase-js'

const bcrypt = require('bcrypt')
const con = require('../db/client.cjs')
const express = require('express')
const router = express.Router()

/*
   We expect that the client should send a JSON in the format:
      {
         "name": [Enter username here]
      }
      Any additions are mentioned in their respective routes
*/


/*
   Create and login will require the pass variable in the form:
      {
         "pass": [Enter password here]
      }
*/

router.post('/create', async(req, res) =>{
   try{

      // We'll hash the password so that unauthorized db access does not guarantee data theft of accounts
      const salt = await bcrypt.genSalt()
      const hash = await bcrypt.hash(req.body.pass, salt)
      
      const user = {name: req.body.name, pass: hash} 
      const query = `insert into public."userInfo"(username, password)
                     values ($1,$2)`

      con.query(query, [user.name,user.pass], (err,result) => {
         if(err){
            console.log(`SQL Error: ${err}`)
            res.status(500).send("Internal SQL error occurred while creating user profile")
         }
         else{
            console.log(result)
            result.status(201).send("User profile created and saved")
         }
      })
   } catch{res.status(500).send("Internal Error: Error occurred while creating account")}
})

router.get('/login', async(res,req) =>{
   try{
      con.query('SELECT password FROM floodwatch_prototype.usertable WHERE username = $1;', [req.body.name], async(err,result)=> {
         
         // If the username doesn't exist in the database
         if(result.rows.length === 0) {
            console.log(err)
            return res.status(404).send("User not found")
         }

         console.log("User found")
         let json = JSON.stringify(result.rows[0]);
         json = JSON.parse(json)

         const pass = json.password

         console.log(pass)

         if (await bcrypt.compare(req.body.password, pass)) 
            res.status(200).send("Success! Log in approved")
         else res.status(401).send("Incorrect password")
      })
   } catch{res.statusCode(500).send("Internal Error: Error occured during login")}
})


/*
   updateUser will require a newUser variable in the form:
      {
         "newuser": [Enter new username here]
      }
*/
router.patch('/updateUser', async(req,res) =>{
   try{
      
   }catch{res.status(500).send("Internal Error: Error occurred while updating account information")}
})


/*
   Similar to updateUser, updatePass will need a newPass variable:
      {
         "newPass": [Enter new password here]
      }
*/
router.patch('/updatePass', async(req,res) =>{

})


/*
   updatePreferences will have a preferences variable:
      {
         "preferences": [Enter preferences here]
      }
   This is separate from create since we will want them 
   to have created an account first.
*/
router.patch('/updatePreferences' , async(req,res) =>{

})

router.delete('/remove', async(req,res)=> {
   try{

   }catch{res.status(500).send("Internal Error: Error occurred while deleting account")}
})

module.exports = router