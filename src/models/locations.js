const connection = require("../configs/db");


const getAllLocation = ( limit) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM locations ${limit}`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const getLocation = (name,limit) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM vehicles INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id INNER JOIN locations ON vehicles.location_id = locations.location_id WHERE locations.location= '${name}' ${limit}`,
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

const insertLocation = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO locations SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const updateLocation = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE locations SET ? WHERE location_id = ?",
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

const deleteLocation = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM locations WHERE location_id = ?",
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
  getAllLocation,
  getLocation,
  insertLocation,
  updateLocation,
  deleteLocation,
};
