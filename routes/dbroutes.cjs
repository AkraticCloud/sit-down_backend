// Router modules for Database actions that don't explicitly involve user info values
const con = require('../db/client.cjs')
const express = require('express')

const router = express.Router()

// Creates a foodList in the database. 
router.post('/createlist', async(req,res) =>{
   try{
      const{foodlist_name, restaurant_id, username} = req.body

      const query = `INSERT INTO public."foodLists"(foodlist_name, restaurant, createdby) 
                     VALUES ($1,$2,$3)`

      const user_id = con.query `select id
                                 from public.profiles
                                 where username = '${username}'` 
      con.query(query,[foodlist_name,restaurant_id,user_id], (err,result) =>{
         if(err){ res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send("Data received, creating FoodList in database")
         }
      })
   } catch{res.status(500).send("Internal Error: Error occurred while creating FoodList")}
})


// Adds a favorited restaurant to a FoodList, should be used if restaurant is already favorited and not added to specified FoodList
router.put('/addtolist', async(req,res) =>{
   try{
      const{foodlist_name, restaurant_id,username} = req.body

      const query = `UPDATE public."foodLists" 
                     set restaurants = array_append(restaurants,'$1')
                     where foodlist_name = $2 AND createdby = $3`
      const user_id = con.query `select id
                                 from public.profiles
                                 where username = '${username}'` 

      con.query(query,[restaurant_id,foodlist_name,user_id], (err,result) => {
         if(err){ res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send("Data received, updating FoodList")
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while adding restaurant to a FoodList")}
})

// Retrieves restaurants from a FoodList
router.get('/foodlists', async(req,res) =>{
   try{
      const{foodlist_name,username} = req.body

      const query = `SELECT foodlist_name, restaurants
                     FROM public."foodLists"
                     WHERE foodlist_name = $1 AND createdby = $2`
      const user_id = con.query `select id
                                 from public.profiles
                                 where username = '${username}'` 

      con.query(query, [foodlist_name,user_id], (err,result) => {
         if(err){ res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send("Request received, sending list to client")
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

// Remove a restaurant from specified FoodList
router.delete('/removefromlist', async(req,res) =>{
   try{
      const{foodlist_name,restaurant_id,username} = req.body

      const query = `update public."foodLists"
                     set restaurants = array_remove(restaurants, '$1')
                     where foodlist_name = $2 and createdby = $3`
      const user_id = con.query `select id
                                 from public.profiles
                                 where username = '${username}'` 

      con.query(query,[restaurant_id,foodlist_name,user_id], (err,result) => {
         if(err) { res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send(`Requset received, deleting from ${foodlist_name}`)
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

//Deletes a FoodList from the database
router.delete('/deletelist', async(req,res) =>{
   try{
      const{foodlist_name,username} = req.body

      const query = `delete from public."foodLists"
                     where foodlist_name = $1 and createdby = $3`
      const user_id = con.query `select id
                                 from public.profiles
                                 where username = '${username}'` 
                                 
      con.query(query,[foodlist_name,user_id], (err,result) => {
         if(err) { res.status(500).send(err) }
         else{
            console.log(result)
            res.status(200).send("Request received, deleting")
         }
      })
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

module.exports = router