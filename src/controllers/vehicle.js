const productModel = require("../models/products");
const helpers = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const dirPath = path.join(__dirname, "../../uploads");
const redis = require("redis");
const client = redis.createClient();

const getAllProduct = (req, res, next) => {
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
    productModel
        .paginationProduct(numPerPage, page, searchPage)
        .then((result) => {
            numRows = result[0].numRows;
            numPages = Math.ceil(numRows / numPerPage);
            console.log("number per pages:", numPerPage);
            console.log("number of pages:", numPages);
            console.log("total pages:", numRows);
        });

    productModel
        .getAllProduct(field, sort, limit, search)
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
            client.setex(
                `products/${numPerPage}/${page}/${sort}/${paramSearch}`,
                60 * 60,
                JSON.stringify(responsePayload)
            );

            helpers.response(res, "Success get data", responsePayload, 200);
        })
        .catch((error) => {
            console.log(error);
            helpers.response(res, "Not found product", null, 404);
        });
};

const getProduct = (req, res, next) => {
    if (req.role == 1 || req.role == 2 || req.role == 3) {
        const id = req.params.id;
        productModel
            .getProduct(id)
            .then((result) => {
                const products = result;
                client.setex(`product/${id}`, 60 * 60, JSON.stringify(products));
                helpers.response(res, "Success get data", products, 200);
            })
            .catch((error) => {
                console.log(error);
                const err = new createError.InternalServerError();
                next(err);
            });
    } else {
        helpers.response(res, "Not Autorized", null, 404);
    }
};

const getProductByCategory = (req, res, next) => {
    const category_id = req.params.category_id;
    const field = req.query.field || "name";
    const sort = req.query.sort || "ASC";
    productModel
        .getProductByCategory(category_id, field, sort)
        .then((result) => {
            const products = result;
            client.setex(
                `product/${category_id}/${field}/${sort}`,
                60 * 60,
                JSON.stringify(products)
            );
            helpers.response(res, "Success get data", products, 200);
        })
        .catch((error) => {
            console.log(error);
            const err = new createError.InternalServerError();
            next(err);
        });
};

const insertProduct = (req, res, next) => {
    if (req.role == 2) {
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
            image4: urlImages[3] || null,
            image5: urlImages[4] || null,
        };

        productModel.insertImagesProduct(dataImages).then(() => {
            productModel.getImagesProductIdInsert().then((result) => {
                const imageId = result[0].image_id;
                const { name, brand, price, description, category_id, category } =
                req.body;
                const data = {
                    name: name,
                    brand: brand,
                    price: price,
                    description: description,
                    category_id: category_id,
                    category: category,
                    image_id: imageId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                productModel
                    .insertProduct(data)
                    .then(() => {
                        helpers.response(res, "Success insert data", data, 200);
                    })
                    .catch((error) => {
                        console.log(error);
                        helpers.response(res, "Not found id product", null, 404);
                        for (var i = 0; i < images.length; i++) {
                            fs.unlink(`${dirPath}/${images[i]}`, (err) => {
                                if (err) {
                                    console.log("Error unlink image product!" + err);
                                }
                            });
                        }
                    });
            });
        });
    } else {
        helpers.response(res, "Not Autorized", null, 404);
    }
};
const updateProduct = (req, res) => {
    if (req.role == 2) {
        const id = req.params.id;

        const imageArr = [];
        const urlImages = [];
        const images = [];
        let dataImages = {}
        let deleteImages = []
        req.files.forEach((element) => {
            const urlFileName = `${process.env.BASE_URL}/files/${element.filename}`;
            const filename = element.filename;
            urlImages.push(urlFileName);
            images.push(filename);
        });
        productModel.getImagesProductIdUpdate(id).then((result) => {
            const imageId = result[0].image_id;
            productModel.getImagesProduct(imageId).then((result) => {
                // console.log(result[0].image1);
                imageArr.push(result[0].image1);
                imageArr.push(result[0].image2);
                imageArr.push(result[0].image3);
                imageArr.push(result[0].image4);
                imageArr.push(result[0].image5);
                // console.log(urlImages.length);
                if (urlImages.length < 1) {
                    dataImages = {
                        image1: imageArr[0] || null,
                        image2: imageArr[1] || null,
                        image3: imageArr[2] || null,
                        image4: imageArr[3] || null,
                        image5: imageArr[4] || null,
                    };
                } else {
                    dataImages = {
                        image1: urlImages[0] || null,
                        image2: urlImages[1] || null,
                        image3: urlImages[2] || null,
                        image4: urlImages[3] || null,
                        image5: urlImages[4] || null,
                    };
                    deleteImages = imageArr
                }


                productModel.updateImagesProduct(imageId, dataImages).then(() => {
                    const { name, brand, price, description, category_id, category } =
                    req.body;
                    const data = {
                        name: name,
                        brand: brand,
                        price: price,
                        description: description,
                        category_id: category_id,
                        category: category,
                        image_id: imageId,
                        updatedAt: new Date(),
                    };
                    productModel
                        .updateProduct(id, data)
                        .then(() => {
                            for (var i = 0; i < deleteImages.length; i++) {
                                fs.unlink(
                                    `${dirPath}/${deleteImages[i].substr(28)}`,
                                    (err) => {
                                        if (err) {
                                            console.log(
                                                "Error unlink image product!" + err
                                            );
                                        }
                                    }
                                );
                            }

                            helpers.response(res, "Success update data", data, 200);
                        })
                        .catch((error) => {
                            console.log(error);
                            helpers.response(res, "Not found id product", null, 404);
                            for (var i = 0; i < images.length; i++) {
                                fs.unlink(`${dirPath}/${images[i]}`, (err) => {
                                    if (err) {
                                        console.log("Error unlink image product!" + err);
                                    }
                                });
                            }
                        });
                });
            });
        });
    } else {
        helpers.response(res, "Not Autorized", null, 404);
    }
};
const deleteProduct = (req, res) => {
    if (req.role == 2) {
        const id = req.params.id;
        productModel
            .deleteProduct(id)
            .then(() => {
                helpers.response(res, "Success delete data", id, 200);
            })
            .catch((err) => {
                console.log(err);
                helpers.response(res, "Not found id product", null, 404);
                for (var i = 0; i < images.length; i++) {
                    fs.unlink(`${dirPath}/${images[i]}`, (err) => {
                        if (err) {
                            console.log("Error unlink image product!" + err);
                        }
                    });
                }
            });
    } else {
        helpers.response(res, "Not Autorized", null, 404);
    }
};

module.exports = {
    getAllProduct,
    getProduct,
    getProductByCategory,
    insertProduct,
    updateProduct,
    deleteProduct,
};