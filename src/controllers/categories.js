const categoryModel = require("../models/categories");
const helpers = require("../helpers/helpers");

const getAllCategory = (req, res, next) => {
   
    categoryModel
      .getAllCategory()
      .then((result) => {
        const categories = result;
        helpers.response(res, "Success get data", categories, 200);
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Not found categories", null, 404);
      });
};

const getCategory = (req, res, next) => {
    const category = req.params.category;
     let limitParams = "";
     const limit = req.query.limit || "";
     if (limit === "") {
       limitParams = "";
     } else {
       limitParams = `LIMIT ${limit}`;
     }
    categoryModel
      .getCategory(category, limitParams)
      .then((result) => {
        const categories = result;
        helpers.response(res, "Success get data", categories, 200);
      })
      .catch((error) => {
        console.log(error);
        const err = new createError.InternalServerError();
        next(err);
      });
};

const insertCategory = (req, res, next) => {
    const { name } = req.body;
    const data = {
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    categoryModel
        .insertCategory(data)
        .then(() => {
            helpers.response(res, "Success insert data", data, 200);
        })
        .catch((error) => {
            console.log(error);
            helpers.response(res, "Not found category", null, 404);
        });
};

const updateCategory = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const data = {
        name: name,
        updatedAt: new Date(),
    };
    categoryModel
        .updateCategory(id, data)
        .then(() => {
            helpers.response(res, "Success update data", data, 200);
        })
        .catch((error) => {
            console.log(error);
            helpers.response(res, "Not found id category", null, 404);
        });
};

const deleteCategory = (req, res) => {
    const id = req.params.id;
    categoryModel
        .deleteCategory(id)
        .then(() => {
            helpers.response(res, "Success delete data", id, 200);
        })
        .catch((err) => {
            console.log(err);
            helpers.response(res, "Not found id category", null, 404);
        });
};

module.exports = {
    getAllCategory,
    getCategory,
    insertCategory,
    updateCategory,
    deleteCategory,
};