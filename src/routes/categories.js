const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categories')
const auth = require("../middlewares/auth");

router
  .get("/",  categoryController.getAllCategory)
  .get("/:category",  categoryController.getCategory)
  .post("/", auth.verifyAccess, categoryController.insertCategory)
  .put("/:id", auth.verifyAccess, categoryController.updateCategory)
  .delete("/:id", auth.verifyAccess, categoryController.deleteCategory);

module.exports = router
