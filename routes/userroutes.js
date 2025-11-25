//Router module for user actions

const bcrypt = require('bcrypt')
const con = require('../db/client.cjs')
const express = require('express')
const router = express.Router()
const { supabase } = require('../utility/supabase.js')

/*
   We expect that the client should send a JSON in the format:
      {
         "name": [Enter username here]
      }
      Any additions are mentioned in their respective routes
*/


/*
   Create and login will require the password variable in the form:
      {
         "password": [Enter password here]
      }
*/

router.post('/create', async(req, res) =>{
   try{
      console.log(req.body)
      const { email, password } = req.body
      console.log(`${email}  ${password}`)
      const { data, error } = await supabase.auth.signUp({ email, password })
      if(error){
         console.log(`Supabase Error: ${error.message}`)
         res.status(500).send(`Internal Error occured while creating account: ${error.message}`)
      }
      res.status(200).send("User successfully created")
   } catch{
      res.status(500).send("Internal Error: Error occurred while creating account")
   }
})

router.get('/login', async(req,res) =>{
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