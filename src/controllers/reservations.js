const reservationModel = require('../models/reservations')
const helpers = require('../helpers/helpers')
const { v4: uuidv4 } = require("uuid");

const getAllReservation = (req, res, next) => {
  reservationModel
    .getAllReservation()
    .then((result) => {
      const reservations = result;
      helpers.response(res, "Success get data", reservations, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found reservation", null, 404);
    });
};

const getReservation = (req, res, next) => {
  const id = req.params.id;
  reservationModel
    .getReservation(id)
    .then((result) => {
      const reservations = result;
      helpers.response(res, "Success get data", reservations, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found id user", null, 404);
    });
};

const insertReservation = (req, res, next) => {
  const { user_id, vehicle_id,date_start,date_stop, total,qty } = req.body;
  const data = {
    reservation_id: uuidv4(),
    user_id: user_id,
    vehicle_id: vehicle_id,
    qty: qty,
    date_start: date_start,
    date_stop: date_stop,
    total: total,
    createdAt: new Date(),
  };

  reservationModel
    .insertReservation(data)
    .then(() => {
      helpers.response(res, "Success insert data", data, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found id reservation", null, 404);
    });
};
const updateReservation = (req, res) => {
  const id = req.params.id
  const { user_id, vehicle_id, date_start, date_stop, total, qty } = req.body;
  const data = {
    user_id: user_id,
    vehicle_id: vehicle_id,
    qty: qty,
    date_start: date_start,
    date_stop: date_stop,
    total: total,
  };
  reservationModel
    .updateReservation(id, data)
    .then(() => {
      helpers.response(res, "Success update data", data, 200);
    })
    .catch((error) => {
      console.log(error);
      helpers.response(res, "Not found id reservation", null, 404);
    });
}
const deleteReservation = (req, res) => {
  const id = req.params.id
  reservationModel
    .deleteReservation(id)
    .then(() => {
      helpers.response(res, "Success delete data", id, 200);
    })
    .catch((err) => {
      console.log(err);
      helpers.response(res, "Not found id reservation", null, 404);
    });
}

module.exports = {
  getAllReservation,
  getReservation,
  insertReservation,
  updateReservation,
  deleteReservation,
};
