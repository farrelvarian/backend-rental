const connection = require("../configs/db");

const paginationProduct = (numPerPage, page, searchPage) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT count(*) as numRows FROM products ${searchPage} `,
            (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
    });
};

const getAllProduct = (field, sort, limit, search) => {
    return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM products INNER JOIN images ON products.image_id=images.image_id ${search} ORDER BY ${field} ${sort} LIMIT ${limit} `,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
    });
};


const getProduct = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM products INNER JOIN images ON products.image_id=images.image_id WHERE products.id = ?",
          id,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
    });
};


const getProductByCategory = (category_id, field, sort) => {
    return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM products INNER JOIN images ON products.image_id=images.image_id WHERE products.category_id = ? ORDER BY ${field} ${sort}`,
          category_id,
          (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
    });
};
const insertImagesProduct = (dataImages) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO images SET ?", dataImages, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};
const getImagesProductIdInsert = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT image_id FROM `images` order BY image_id DESC LIMIT 1",

      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};
const insertProduct = (data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO products SET ?", data, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};
const getImagesProductIdUpdate = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT image_id FROM `products` where id=?",id,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};
const getImagesProduct = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT image1,image2,image3,image4,image5 FROM `images` WHERE image_id = ?",
      id,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};
const updateImagesProduct = (id, dataImages) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE images SET ? WHERE image_id = ?",
      [dataImages, id],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};
const updateProduct = (id, data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "UPDATE products SET ? WHERE id = ?", [data, id],
            (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
    });
};

const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM products WHERE id = ?",
            id,
            (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
    });
};

module.exports = {
  paginationProduct,
  getAllProduct,
  getProduct,
  getProductByCategory,
  insertImagesProduct,
  getImagesProductIdInsert,
  getImagesProduct,
  insertProduct,
  getImagesProductIdUpdate,
  updateImagesProduct,
  updateProduct,
  deleteProduct,
};