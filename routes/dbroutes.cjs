// Router modules for Database actions that don't explicitly involve user info values
const con = require('../db/client.cjs')
const express = require('express')

const router = express.Router()

// Saves a favorited restaurant to the database for creating FoodLists
router.post('/saveRestaurant', async(req,res) =>{
   try{

   } catch{res.status(500).send("Internal Error: Error Occurred while saving restaurant to database.")}
})

// Adds a favorited restaurant to a FoodList, should be used if restaurant is already favorited and not added to specified FoodList
router.put('/addtolist', async(req,res) =>{
   try{

   }catch{res.status(500).send("Internal Error: Error occurred while adding restaurant to a FoodList")}
})

// Retrieves restaurants from a FoodList
router.get('/savedRestaurants', async(req,res) =>{
   try{

   }catch{res.status(500).send("Internal Error: Error Occurred while retrieving FoodList restuarants")}
})

module.exports = router