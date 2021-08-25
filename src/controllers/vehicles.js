const vehicleModel = require("../models/vehicles");
const helpers = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const dirPath = path.join(__dirname, "../../uploads");


const getAllVehicle = (req, res, next) => {
    let numRows;
    const numPerPage = parseInt(req.query.npp) || 15;
    const page = parseInt(req.query.page) || 1; 
    let numPages;
    const skip = (page - 1) * numPerPage;
    const field = req.query.field || "name";
    const sort = req.query.sort || "ASC";
    const paramSearch = req.query.search || "";
    let search = `WHERE name LIKE '%${paramSearch}%'`;
    if (search != "WHERE name LIKE '%%'") {
        search = `WHERE name LIKE '%${paramSearch}%'`;
    } else {
        search = "";
    }
    let searchPage = search;
    // Here we compute the LIMIT parameter for MySQL query
    const limit = skip + "," + numPerPage;
    vehicleModel
        .paginationVehicle(numPerPage, page, searchPage)
        .then((result) => {
            numRows = result[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
            console.log("number per pages:", numPerPage);
            console.log("number of pages:", numPages);
            console.log("total pages:", numRows);
        });

    vehicleModel
        .getAllVehicle(field, sort, limit, search)
        .then((result) => {
            const responsePayload = {
                result: result,
            };
            if (page <= numPages) {
                responsePayload.pagination = {
                    totalData: numRows,
                    current: page,
                    totalPages: numPages,
                    perPage: numPerPage,
                    previous: page > 1 ? page - 1 : undefined,
                    next: page < numPages ? page + 1 : undefined,
                    sortBy: field,
                    orderBy: sort,
                    search: paramSearch,
                };
            } else {
                responsePayload.pagination = {
                    err: "queried page " +
                        page +
                        " is >= to maximum page number " +
                        numPages,
                };
            }

            helpers.response(res, "Success get data", responsePayload, 200);
        })
        .catch((error) => {
            console.log(error);
            helpers.response(res, "Not found vehicle", null, 404);
        });
};

const getVehicle = (req, res, next) => {

        const id = req.params.id;
        vehicleModel
            .getVehicle(id)
            .then((result) => {
                const vehicles = result;
                helpers.response(res, "Success get data", vehicles, 200);
            })
            .catch((error) => {
                console.log(error);
                const err = new createError.InternalServerError();
                next(err);
            });

};

const getVehicleByCategory = (req, res, next) => {
    const category_id = req.params.category_id;
    const field = req.query.field || "name";
    const sort = req.query.sort || "ASC";
    vehicleModel
        .getVehicleByCategory(category_id, field, sort)
        .then((result) => {
            const vehicles = result;
            helpers.response(res, "Success get data", vehicles, 200);
        })
        .catch((error) => {
            console.log(error);
            const err = new createError.InternalServerError();
            next(err);
        });
};

const insertVehicle = (req, res, next) => {
 
        const urlImages = [];
        const images = [];
        req.files.forEach((element) => {
            const urlFileName = `${process.env.BASE_URL}/files/${element.filename}`;
            const filename = element.filename;
            urlImages.push(urlFileName);
            images.push(filename);
        });
        const dataImages = {
            image1: urlImages[0] || null,
            image2: urlImages[1] || null,
            image3: urlImages[2] || null,
        };

       vehicleModel.insertImagesVehicle(dataImages).then(() => {
        vehicleModel.getImagesVehicleIdInsert().then((result) => {
          const imageId = result[0].image_id;
          const {
            name,
            location_id,
            price,
            description,
            category_id,
            stock,
            status,
          } = req.body;
          const data = {
            name: name,
            price: price,
            description: description,
            category_id: category_id,
            location_id: location_id,
            stock: stock,
            status: status,
            image_id: imageId,
            createdAt: new Date(),
          };
          vehicleModel.insertVehicle(data)
            .then(() => {
              helpers.response(res, "Success insert data", data, 200);
            })
            .catch((error) => {
              console.log(error);
              helpers.response(res, "Not found id vehicle", null, 404);
              for (var i = 0; i < images.length; i++) {
                fs.unlink(`${dirPath}/${images[i]}`, (err) => {
                  if (err) {
                    console.log("Error unlink image vehicle!" + err);
                  }
                });
              }
            });
        });
       });

};
const updateVehicle = (req, res) => {

    const id = req.params.id;

    const imageArr = [];
    const urlImages = [];
    const images = [];
    let dataImages = {};
    let deleteImages = [];
    req.files.forEach((element) => {
      const urlFileName = `${process.env.BASE_URL}/files/${element.filename}`;
      const filename = element.filename;
      urlImages.push(urlFileName);
      images.push(filename);
    });
    vehicleModel.getImagesVehicleIdUpdate(id).then((result) => {
      const imageId = result[0].image_id;
      vehicleModel.getImagesVehicle(imageId).then((result) => {
        // console.log(result[0].image1);
        imageArr.push(result[0].image1);
        imageArr.push(result[0].image2);
        imageArr.push(result[0].image3);
        // console.log(urlImages.length);
        if (urlImages.length < 1) {
          dataImages = {
            image1: imageArr[0] || null,
            image2: imageArr[1] || null,
            image3: imageArr[2] || null,
          };
        } else {
          dataImages = {
            image1: urlImages[0] || null,
            image2: urlImages[1] || null,
            image3: urlImages[2] || null,
          };
          deleteImages = imageArr;
        }

        vehicleModel.updateImagesVehicle(imageId, dataImages).then(() => {
          const {
            name,
            location_id,
            price,
            description,
            category_id,
            stock,
            status,
          } = req.body;
          const data = {
            name: name,
            price: price,
            description: description,
            category_id: category_id,
            location_id: location_id,
            stock: stock,
            status: status,
            image_id: imageId,
            updatedAt: new Date(),
          };
    vehicleModel
      .updateVehicle(id, data)
      .then(() => {
        for (var i = 0; i < deleteImages.length; i++) {
          fs.unlink(`${dirPath}/${deleteImages[i].substr(28)}`, (err) => {
            if (err) {
              console.log("Error unlink image vehicle!" + err);
            }
          });
        }

        helpers.response(res, "Success update data", data, 200);
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Not found id vehicle", null, 404);
        for (var i = 0; i < images.length; i++) {
          fs.unlink(`${dirPath}/${images[i]}`, (err) => {
            if (err) {
              console.log("Error unlink image vehicle!" + err);
            }
          });
        }
      });
        });
      });
    });

};
const deleteVehicle = (req, res) => {
//   if (req.role == 2) {
    const id = req.params.id;
    vehicleModel.deleteVehicle(id)
      .then(() => {
        helpers.response(res, "Success delete data", id, 200);
      })
      .catch((err) => {
        console.log(err);
        helpers.response(res, "Not found id vehicle", null, 404);
        for (var i = 0; i < images.length; i++) {
          fs.unlink(`${dirPath}/${images[i]}`, (err) => {
            if (err) {
              console.log("Error unlink image vehicle!" + err);
            }
          });
        }
      });

};

module.exports = {
  getAllVehicle,
  getVehicle,
  getVehicleByCategory,
  insertVehicle,
  updateVehicle,
  deleteVehicle,
};