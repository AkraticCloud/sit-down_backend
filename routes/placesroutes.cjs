// Router Module for handling 
const express = require('express')
const { rmSync } = require('fs')
const {PlacesClient} = require('@googlemaps/places').v1
const router = express.Router()

require('dotenv').config()

const placesClient = new PlacesClient({
   apiKey: process.env.PLACES_API_KEY
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
      locationRestriction: { //fixed typo
         circle: {
            center: center,
            radius: rad
         }
      },
      includedTypes: ['restaurant'],
      maxResultCount: 20 //We'll try to max out the result to send 20 restaurants
   }
   
   const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.primaryType'
   ].join(',')

   let results = []

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
      return []

   }
}

async function searchPlaceID(placeID) {

   // The API requires resources name in the format: "places/PLACE_ID"
   const placeName = `places/${placeID}`

   const request= {
      name: placeName,
   }

   //To save on costs, we'll only grab the fields available in the Basic SKU
   const fieldMask = [
      'places.displayName',
      'places.formattedAddress',
   ].join(',')
   
   try{
      const [response] = await placesClient.getPlace( request, {
         otherArgs: {
            headers: {
               'X-Goog-FieldMask' : fieldMask,
            }
         }
      })

      const placeDetails = response.place

      const result = {
         'Name': placeDetails.displayName?.text,
         'Address': placeDetails.formattedAddress
      }

      console.log(result)

      return result
   } catch {
      console.error(`Error fetching Place Details`)
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

router.post("/nearby", async(req, res) =>{
   const {lat,long, radius} = req.body

   if (
      typeof lat !== "number" ||
      typeof long !== "number" ||
      typeof radius !== "number"||
      radius <= 0 ||
      radius > 50000
   ){
      return res.status(400).json({error: 'Invalid coordinates or radius'})
   }
   try{
      const nearbyPlaces = await searchNearbyPlaces(lat,long,radius)
      return res.status(200).json(nearbyPlaces)
   }
   catch(error){ 
      console.error('Error fetching nearby place details:', error)
      return res.status(500).json({ error: "Internal Error occurred while searching nearby place details" })
   }
})

/*
   For this functionn, we require the place ids, which are stored in the database and should be retrieved by the frontend
   when accessing foodlists

   [
      {
         "placeID": [Enter ID here]
      },
      ...
   ]

   We want the client to send an array of JSON data corresponding to the number of restaurants in the foodlist
*/

router.get("/details", async(req,res) =>{
   const detailIDs = req.body

   if(!Array.isArray(detailIDs)) return res.status(400).send('Request body must be an array of JSON objects')
   
   const response = []
   try{
      for( const item in detailIDs ){
         let details = await searchPlaceID(item.placeID)
         response.push(details)
      }
      
      res.contentType('application/json')
      return res.status(200).send(response)
   }
   catch{ return res.status(500).send("Internal error occurred while searching place details")}
})

module.exports = router