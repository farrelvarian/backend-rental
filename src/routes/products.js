const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

router
  .get("/", productController.getAllProduct)
  .get("/:id", productController.getProduct)
  .get("/category/:category_id", productController.getProductByCategory)
  .post("/", productController.insertProduct)
  .put("/:id", productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

module.exports = router;
