const connection = require("../configs/db");

const paginationVehicle = (numPerPage, page, searchPage) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT count(*) as numRows FROM vehicles ${searchPage} `,
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

const getAllVehicle = (field, sort, limit, search) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM vehicles INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id
	INNER JOIN locations ON vehicles.location_id = locations.location_id ${search} ORDER BY ${field} ${sort} LIMIT ${limit} `,
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


const getVehicle = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM vehicles  INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id INNER JOIN locations ON vehicles.location_id = locations.location_id WHERE vehicles.id = ?",
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


const getVehicleByCategory = (category_id, field, sort) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM vehicles INNER JOIN images ON vehicles.image_id=images.image_id WHERE vehicles.category_id = ? ORDER BY ${field} ${sort}`,
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
const insertImagesVehicle = (dataImages) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO images SET ?",
      dataImages,
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
const getImagesVehicleIdInsert = () => {
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
const insertVehicle = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO vehicles SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};
const getImagesVehicleIdUpdate = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT image_id FROM `vehicles` where id=?",
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
const getImagesVehicle = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT image1,image2,image3 FROM `images` WHERE image_id = ?",
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
const updateImagesVehicle = (id, dataImages) => {
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
const updateVehicle = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE vehicles SET ? WHERE id = ?",
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

const deleteVehicle = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM vehicles WHERE id = ?",
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
  paginationVehicle,
  getAllVehicle,
  getVehicle,
  getVehicleByCategory,
  insertImagesVehicle,
  getImagesVehicleIdInsert,
  getImagesVehicle,
  insertVehicle,
  getImagesVehicleIdUpdate,
  updateImagesVehicle,
  updateVehicle,
  deleteVehicle,
};