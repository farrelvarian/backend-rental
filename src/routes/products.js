const express = require("express");
const router = express.Router();
const productController = require("../controllers/vehicle");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const redisCache = require("../middlewares/redis");

router
  .get("/", productController.getAllProduct)
  .get(
    "/:id",
    auth.verifyAccess,
    productController.getProduct
  )
  .get(
    "/category/:category_id",
    productController.getProductByCategory
  )
  .post(
    "/",
    auth.verifyAccess,
    upload.array("images", 3),
    productController.insertProduct
  )
  .put(
    "/:id",
    auth.verifyAccess,

    upload.array("images", 5),
    productController.updateProduct
  )
  .delete(
    "/:id",
    auth.verifyAccess,
    productController.deleteProduct
  );

module.exports = router;