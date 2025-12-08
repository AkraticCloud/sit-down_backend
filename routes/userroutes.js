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
      const { error } = await supabase.auth.signUp({ 
         email, 
         password,
         options: {
            data:{ username }
         },
      })
      if(error){
         console.log(`Supabase Error: ${error.message}`)
         return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ message: `Created account for ${email}` })
   } catch(err){
      console.error('Create error:', err.message)
      return res.status(500).json({ error: 'Internal server error' })
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
   res.cookie('sb-access-token', data.session.access_token, {
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
   return res.status(200).send(``)
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
      
      const { error } = await supabase
         .from("profiles")
         .update({ username: newUser })
         .eq('email', email)

      if( error ) return res.status(500).json({ Error: error.message })

      return res.status(200).send(`User name updated to ${newUser}`)
   } catch(err){ 
      console.error('Update error:', err.message)
      return res.status(500).json({ error: 'Internal server error' })
   }
})


/*
   Similar to updateUser, updatePass will need a newPass variable:
      {
         "newPass": [Enter new password here]
      }
*/
router.patch('/updatePass', async(req,res) =>{
   try{
      const {newPassword} = req.body
      const {error} = await supabase.auth.updateUser({ //assumes user is authenticated
         password: newPassword
      })
      if(error){
         return res.status(500).json({error: error.message})
      }
      return res.status(200).json({ message: 'Password updated'})
   }catch(err){
      console.error('Password error:', err)
      return res.status(500).json({ error: 'Internal server error' })
   }
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
   try{
      const {email, preferences} = req.body
      
      const { error } = await supabase
         .from("profiles")
         .update({ preferences: preferences})
         .eq("email", email)

      if( error ) return res.status(500).json({ Error: error.message })

      return res.status(200).send(`Prefernces updated`)
   }catch(err){
      console.error('Preferences error:', err.message)
      return res.status(500).json({ error: 'Internal server error' })
   }
})

router.delete('/remove', async(req,res)=> {
   try{
      const email = req.body.email

      const { data, error: fetchError} = await supabase
         .from("profiles")
         .select("id")
         .eq("email", email)
         .single()
      if ( fetchError ) return res.status(500).json({ Error: fetchError.message })
      if ( !data ) return res.status(404).json({ Error: `User not found`})

      const { error } = await supabase.auth.admin.deleteUser(userID)
      if(error){
         console.error('Delete error:', error.message)
         return res.status(500).json({ error: error.message })
      }

      res.status(200).json({Message: `Account deleted`})
   }catch(err){
      console.error('Remove error:', err.message)
      return res.status(500).json({error: 'Internal server error'})
   }
})

module.exports = router