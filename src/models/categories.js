const connection = require("../configs/db");

const getAllCategory = () => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM categories `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const getCategory = (name,limit) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM vehicles INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id INNER JOIN locations ON vehicles.location_id = locations.location_id WHERE categories.category= '${name}' ${limit}`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
  });
};

const insertCategory = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO categories SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const updateCategory = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE categories SET ? WHERE category_id = ?",
      [data, id],
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

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM categories WHERE category_id = ?",
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
  getAllCategory,
  getCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
};
