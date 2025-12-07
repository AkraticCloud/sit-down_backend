//Router module for user actions


const con = require('../db/client.cjs')
const express = require('express')
const router = express.Router()
const { supabase } = require('../utility/supabase.js')

/*
   We expect that the client requests should send a JSON that at least contains:
      {
         "email": [Enter email here]
      }
      Any additions are mentioned in their respective routes
*/


/*
   Create will require the password and username variable in the order:
      {
         "password": [Enter password here],
         "username": [Enter username here]
      }
*/
router.post('/create', async(req, res) =>{
   try{
      const { email, password, username } = req.body
      console.log(`${email}\t${password}\t${username}`)
      const { data, error } = await supabase.auth.signUp({ 
         email, 
         password,
         options: {
            data:{
               username: username
            },
         }, 
      })
      if(error){
         console.log(`Supabase Error: ${error.message}`)
         res.status(500).send(`Internal Error occured while creating account: ${error.message}`)
      }

      res.status(200).send(`Added ${username} into account belonging to ${email}`)   
   } catch{
      res.status(500).send("Internal Error: Error occurred while creating account")
   }
})

/*
   Login will require the password variable in the form:
      {
         "password": [Enter password here],
      }
*/
router.post('/login', async (req, res) => {
   try {
   const { email, password } = req.body;

   // Attempt Supabase login
   const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
   });

   // Invalid credentials
   if (error) {
      console.log(`Supabase Error: ${error.message}`);
   return res.status(401).json({ error: 'Invalid credentials' });
   }

   // Null session check
   if (!data.session) {
   return res.status(400).json({ error: 'Login failed: no session returned' });
   }

   // Set secure HTTP-only cookie
   res.cookie('access_token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', //allow cross-site cookie sending
      maxAge: data.session.expires_in * 1000 // expire in 1 hour
   });

   return res.status(200).json({ ok: true });

   } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});


router.get("/logout", (req,res) => {
   res.clearCookie("access_token")
   res.status(200).send(``)
})

/*
   updateUser will require a newUser variable in the form:
      {
         "newuser": [Enter new username here]
      }
*/
router.patch('/updateUser', async(req,res) =>{
   try{
      const {email, newUser} = req.body
      const query = `UPDATE public.profiles
                     SET username = '$1'
                     WHERE email = '$2'`
      
      con.query(query, [newUser,email], (err,result) =>{
         if(err) { res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send(`Added username ${username} into account belonging to ${email}`)
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while updating account information")}
})


/*
   Similar to updateUser, updatePass will need a newPass variable:
      {
         "newPass": [Enter new password here]
      }
*/
router.patch('/updatePass', async(req,res) =>{
   try{
      const {email, newPassword} = req.body
      const {data,error} = await supabase.auth.updateUser({
         password: newPassword
      })
      return {data,error}
   }catch{res.status(500).send("Internal error occurred while updating password")}
})


/*
   updatePreferences will have a preferences variable:
      {
         "preferences": [Enter preferences here],  
      }
      
   *This attribute is an array of text, so you can send an array for this
   **This is separate from create since we will want them 
   to have created an account first.
*/
router.patch('/updatePreferences' , async(req,res) =>{
   const {email, preferences} = req.body

   const query = `UPDATE public.profiles
                  SET prefernce = $1
                  WHERE email = '$2'`
   
   con.query(query, [preferences, email], (err,result) =>{
      if(err) { res.status(500).send(err) }
      else{
         console.log(result)
         res.status(200).send(`Updated preferences`)
      }
   })
})

router.delete('/remove', async(req,res)=> {
   try{
      const email = req.body.email

      const query = `SELECT id
                     FROM public.profiles
                     WHERE email = '$1'`
      con.query(query, [email], async(err,result) =>{
         if(err) { res.status(500).send(err) }
         else{
            const userID = result.rows[0].id
            const { data, error } = await supabase.auth.admin.deleteUser({ userID })
            if(error){
               console.log(`Supabase Error: ${error.message}`)
            }
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while deleting account")}
})

module.exports = router