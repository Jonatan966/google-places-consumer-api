import { promises as fs } from 'fs'
import path from 'path'
import { PlaceInputType } from '@googlemaps/google-maps-services-js'
import { Request, Response } from 'express'

import { useErrorMessage } from '../hooks/useErrorMessage'
import { placesClient } from '../services/googlePlaces'

export const PlaceDetailsController = {
  async getPlaceDetails(req: Request, res: Response) {
    const { input } = req.query

    if (!input) {
      return useErrorMessage('"input" param is required', 200, res)
    }

    const { data: placeResponseData } = await placesClient.findPlaceFromText({
      params: {
        key: process.env.GOOGLE_PLACES_KEY,
        input: 'são paulo',
        inputtype: PlaceInputType.textQuery,
        fields: ['photos', 'geometry']
      }
    })

    if (!placeResponseData.candidates.length) {
      return useErrorMessage('place not found', 200, res)
    }

    const placeDetails = placeResponseData.candidates[0]

    const finalPlaceObject = {
      coordinates: placeDetails.geometry.location,
      imageURL: `${process.env.APP_URL}/place-photos/${placeDetails.photos[0].photo_reference}`
    }

    return res
      .status(200)
      .json(finalPlaceObject)
  },

  async getPlacePhoto(req: Request, res: Response) {
    const { id: photoReference } = req.params

    res.setHeader('Content-Type', 'image/jpg')

    try {
      const placePhotoResponse = await placesClient.placePhoto({
        params: {
          key: process.env.GOOGLE_PLACES_KEY,
          photoreference: String(photoReference),
          maxwidth: 750,
          maxheight: 750
        },
        responseType: 'arraybuffer'
      })  
    
      res.send(placePhotoResponse.data)  
    }
    catch {
      const notFoundImage = await fs.readFile(path.join(__dirname, '..', '..', 'images', 'not-found.jpg'))

      res.send(notFoundImage)
    }
  }
}
