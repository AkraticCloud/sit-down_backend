// Router Module for handling 
const express = require('express')
const {PlacesClient} = require('@googlemaps/places')
const router = express.Router()

const placesClient = new PlacesClient()

async function searchNearbyPlaces(lat, lon, rad){
   try{
      const response = await placesClient.searchNearby({
         params: {
            location: {lat: lat, lng: lon},
            radius: rad,
         },
         timeout: 1000
      })
      console.log(response.data.results)
      return response.data.results
   }
   catch(error){
      console.error(`Error searching places: ${error}`)
      throw error
   }
}

router.get("/nearby" , async(req, res) =>{
   
})
module.exports = router