const locationModel = require("../models/locations");
const helpers = require("../helpers/helpers");

const getAllLocation = (req, res, next) => {
  let limitParams = "";
  const limit = req.query.limit || "";
  if (limit === "") {
    limitParams = "";
  } else {
    limitParams = `LIMIT ${limit}`;
  }
  locationModel
    .getAllLocation(limitParams)
    .then((result) => {
      const locations = result;
      helpers.response(res, "Success get data", locations, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found locations", null, 404);
    });
};

const getLocation = (req, res, next) => {
  const location = req.params.location;
   let limitParams = "";
   const limit = req.query.limit || "";
   if (limit === "") {
     limitParams = "";
   } else {
     limitParams = `LIMIT ${limit}`;
   }
  locationModel
    .getLocation(location, limitParams)
    .then((result) => {
      const locations = result;
      helpers.response(res, "Success get data", locations, 200);
    })
    .catch((error) => {
      console.log(error);
      const err = new createError.InternalServerError();
      next(err);
    });
};

const insertLocation = (req, res, next) => {
  const { name } = req.body;
  const data = {
    name: name,
    createdAt: new Date(),
  };

  locationModel
    .insertLocation(data)
    .then(() => {
      helpers.response(res, "Success insert data", data, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found category", null, 404);
    });
};

const updateLocation = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const data = {
        name: name,
        updatedAt: new Date(),
    };
    locationModel
      .updateLocation(id, data)
      .then(() => {
        helpers.response(res, "Success update data", data, 200);
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Not found id category", null, 404);
      });
};

const deleteLocation = (req, res) => {
    const id = req.params.id;
    locationModel
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
  getAllLocation,
  getLocation,
  insertLocation,
  updateLocation,
  deleteLocation,
};