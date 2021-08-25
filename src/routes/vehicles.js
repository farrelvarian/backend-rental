const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicles");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");


router
  .get("/", vehicleController.getAllVehicle)
  .get("/:id", auth.verifyAccess, vehicleController.getVehicle)
  .get(
    "/category/:category_id",
    auth.verifyAccess,
    vehicleController.getVehicleByCategory
  )
  .post(
    "/",

    upload.array("images", 3),
    auth.verifyAccess,
    auth.autorizedAdmin,
    vehicleController.insertVehicle
  )
  .put(
    "/:id",

    upload.array("images", 3),
    auth.verifyAccess,
    auth.autorizedAdmin,
    vehicleController.updateVehicle
  )
  .delete(
    "/:id",
    auth.verifyAccess,
    auth.autorizedAdmin,
    vehicleController.deleteVehicle
  );

module.exports = router;