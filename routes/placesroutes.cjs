// Router Module for handling 
const express = require('express')
const {PlacesClient} = require('@googlemaps/places').v1
const router = express.Router()

require('dotenv').config()

const placesClient = new PlacesClient({
   apiKey: process.env.PLACE_API_KEY
})

/*
   We are going to user Search Nearby from the Google Places(New) API
   We can find nearby places through user coordinates
   
   For that to work, we need the frontend to have access the user's coordinates and send it to
   the Backend so that we can find the nearest restaurants.
*/

// This function invokes Nearby Search from Google Places(New) 
async function searchNearbyPlaces(lat, lon, rad){
   const center = {
      latitude: lat,
      longitude: lon
   }
   
   const request = {
      loactionRestriction: {
         circle: {
            center: center,
            radius: rad
         }
      },
      includedTypes: ['restaurant'],
      maxResultCount: 30 // We'll try to max out the results to send 30 restaurants
   }
   
   const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.primaryType'
   ].join(',')

   try{
      const [response] = await placesClient.searchNearby(request, {
         otherArgs: {
            headers: {
               'X-Goog-FieldMask': fieldMask
            }
         }
      })
      
      const results = response.places.map(place =>({
         placeid: place.id,
         name: place.displayName?.text || "Unknown",
         address: place.formattedAddress,
         primaryType: place.primaryType
      }))

      console.log(results)
      return results
   }
   catch(error){
      console.error(`API Error: ${error}`)

   }
}

/*
   For this function, we require the coordinates of the user and the radius of how far the user wants to search
   in this following format:
      {
         "latitude": [Enter user's latitude value],
         "longitiude": [Enter user's longitude value],
         "radius": [Enter search radius]
      }
*/

router.get("/nearby", async(req, res) =>{
   const {lat,long, radius} = req.body
   try{
      const nearbyPlaces = await searchNearbyPlaces(lat,long,radius)
      res.status(200).send(nearbyPlaces)
   }
   catch{ res.status(500).send("Internal Error occurred while calling to Google Maps API") }
})
module.exports = router