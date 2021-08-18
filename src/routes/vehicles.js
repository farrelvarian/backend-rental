const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicles");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");


router
  .get("/", vehicleController.getAllVehicle)
  .get("/:id", vehicleController.getVehicle)
  .get("/category/:category_id", vehicleController.getVehicleByCategory)
  .post(
    "/",
    
    upload.array("images", 3),
    vehicleController.insertVehicle
  )
  .put(
    "/:id",
    

    upload.array("images", 3),
    vehicleController.updateVehicle
  )
  .delete("/:id",  vehicleController.deleteVehicle);

module.exports = router;