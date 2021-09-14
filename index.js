require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const vehicleRouter = require("./src/routes/vehicles");
const userRouter = require("./src/routes/users");
const categoryRouter = require("./src/routes/categories");
const locationRouter = require("./src/routes/locations");
const reservationRouter = require("./src/routes/reservations");
const userAuthRouter = require("./src/routes/userAuth");
const morgan = require("morgan");
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

// middleware

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
// const optionCors = { credentials: true, origin:`${process.env.FRONT_URL}` };
// app.use(cors(optionCors));
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // If needed
  res.header("Access-Control-Allow-Credentials", true); // If needed
  next();
});
app.use(cookieParser());

app.use("/vehicles", vehicleRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/locations", locationRouter);
app.use("/reservations", reservationRouter);
app.use("/", userAuthRouter);
app.use("/files", express.static("./uploads"));




app.use("/file", express.static("./uploads"));
//  catch error and forward to error handler

app.use("*", (req, res, next) => {
  const error = new createError.NotFound();
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "internal server Error",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;