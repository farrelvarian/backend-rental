const express = require('express')
const router = express.Router()
const locationController = require('../controllers/locations')
const auth = require("../middlewares/auth");

router
  .get("/",  locationController.getAllLocation)
  .get("/:location",  locationController.getLocation)
  .post("/", auth.verifyAccess, locationController.insertLocation)
  .put("/:id", auth.verifyAccess, locationController.updateLocation)
  .delete("/:id", auth.verifyAccess, locationController.deleteLocation);

module.exports = router
