const connection = require('../configs/db')

const getAllReservation = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM reservations  INNER JOIN users ON reservations.user_id = users.id INNER JOIN vehicles ON reservations.vehicle_id = vehicles.id INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id INNER JOIN locations ON vehicles.location_id = locations.location_id",
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  })
}

const getReservation = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM reservations  INNER JOIN users ON reservations.user_id = users.id INNER JOIN vehicles ON reservations.vehicle_id = vehicles.id INNER JOIN images ON vehicles.image_id=images.image_id INNER JOIN categories ON vehicles.category_id = categories.category_id INNER JOIN locations ON vehicles.location_id = locations.location_id WHERE users.id = ?",
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

const insertReservation = (data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO reservations SET ?",
      data,
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

const updateReservation = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE reservations SET ? WHERE id = ?",
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

const deleteReservation = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM reservations WHERE id = ?",
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
  getAllReservation,
  getReservation,
  insertReservation,
  updateReservation,
  deleteReservation,
};
