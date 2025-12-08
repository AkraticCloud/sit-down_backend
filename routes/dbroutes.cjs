// Router modules for Database actions that don't explicitly involve user info values
const { default: supabase } = require('../db/client.cjs')
const con = require('../db/client.cjs')
const express = require('express')

const router = express.Router()

// Creates a foodList in the database. 
router.post('/createlist', async(req,res) =>{
   try{
      const{foodlist_name, restaurant_id, username} = req.body

      const { error } = await supabase
         .from("foodLists")
         .insert({
            foodlist_name: foodlist_name,
            restaurants: [restaurant_id],
            createdby: username
         })

      if( error ) return res.status(500).json({Error: error.messsage })
      
      return res.status(200).send({Message:" FoodList created"})
   } catch{res.status(500).send({Message: "Internal Error: Error occurred while creating FoodList"})}
})


// Adds a favorited restaurant to a FoodList, should be used if restaurant is already favorited and not added to specified FoodList
router.put('/addtolist', async(req,res) =>{
   try{
      const{foodlist_name, restaurant_id,username} = req.body

      const {data, error} = await supabase
      .from("foodLists")
      .select('restuarants')
      .eq('foodlist_name', foodlist_name )
      .eq('createdby', username )

      if(error){
         Console.log(`Error fetching data: ${error}`)
      }

      const restaurantIds = data.restaurants
      restaurantIds.push(restaurant_id)

      const { error: updateError } = await supabase
         .from("foodLists")
         .update({
            restaurants: restaurantIds
         })
         .eq('foodlist_name', foodlist_name )
         .eq('createdby', username )

         if (updateError) return res.status(500).json({Error: updateError.message})
         
      return res.status(200).send(`Update successful`)
   }catch{res.status(500).send("Internal Error: Error occurred while adding restaurant to a FoodList")}
})

// Retrieves the foodlists made by a given user. 
router.get('/foodlists', async(req,res) =>{
   try{
      const{username} = req.body

      const { data, error } = await supabase
         .from("foodLists")
         .select('foodlist_name, restaurants')
         .eq('createdby', username)
      if (error) return res.status(500).json({Error: error.message})

      const foodLists = foodLists
      return res.status(200).send(foodLists)
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

router.get('/foodlistscontent', async(req, res) => {
   try{
      const{foodlist_name, username} = req.body

      const { data, error } = await supabase
         .from("foodLists")
         .select("restaurants")
         .eq("foodlist_name", foodlist_name)
         .eq("createdby", username)
         .single()
      
      if ( error ) return res.status(500).json({ Error: error.message })

      return res.status(200).json(data)
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving restaurants from a foodList")}
})

// Remove a restaurant from specified FoodList
router.delete('/removefromlist', async(req,res) =>{
   try{
      const{foodlist_name,restaurant_id,username} = req.body

      const {data, error} = await supabase
      .from("foodLists")
      .select('restuarants')
      .eq('foodlist_name', foodlist_name )
      .eq('createdby', username )

      if(error){
         Console.log(`Error fetching data: ${error}`)
      }

      const restaurantIds = data.restaurants

      const removeInd = restaurantIds.indexOf(restaurant_id)
      if (removeInd > -1){
         restaurantIds.splice(removeInd, 1)
      }

      const { error: updateError } = await supabase
         .from("foodLists")
         .update({
            restaurants: restaurantIds
         })
         .eq('foodlist_name', foodlist_name )
         .eq('createdby', username )

         if (updateError) return res.status(500).json({Error: updateError.message})
         
      return res.status(200).send(`Update successful`)
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

//Deletes a FoodList from the database
router.delete('/deletelist', async(req,res) =>{
   try{
      const{foodlist_name,username} = req.body

      const { error } = await supabase
         .from("foodLists")
         .delete()
         .eq("foodlist_name", foodlist_name)
         .eq("createdby", username)
      if ( error ) return res.status(500).json({ Error: error.message})
      
      return res.status(200).send(`${foodlist_name} deleted`)
   }catch{res.status(500).send("Internal Error: Error occurred while retrieving FoodList restuarants")}
})

module.exports = router