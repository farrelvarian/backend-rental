const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservations')
const auth = require("../middlewares/auth");

router
  .get(
    "/",
    auth.verifyAccess,
    auth.autorizedAdmin,
    reservationController.getAllReservation
  )
  .get(
    "/:id",
    auth.verifyAccess,
    auth.autorizedMember,
    reservationController.getReservation
  )
  .post(
    "/",
    auth.verifyAccess,
    auth.autorizedMember,
    reservationController.insertReservation
  )
  .put("/:id", auth.verifyAccess, reservationController.updateReservation)
  .delete("/:id", auth.verifyAccess, reservationController.deleteReservation);

module.exports = router
