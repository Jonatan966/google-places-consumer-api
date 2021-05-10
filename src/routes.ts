import { Router } from "express";
import { PlaceDetailsController } from "./controllers/PlaceDetailsController";

const appRoutes = Router()

appRoutes.get('/place-details', PlaceDetailsController.getPlaceDetails)
appRoutes.get('/place-photos/:id', PlaceDetailsController.getPlacePhoto)

export { appRoutes }
