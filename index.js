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
const port = process.env.DB_PORT || 3500;
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

// middleware

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
const optionCors = { credentials: true, origin:`${process.env.FRONT_URL}` };
app.use(cors(optionCors));
app.use(cookieParser());

app.use("/vehicles", vehicleRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/locations", locationRouter);
app.use("/reservations", reservationRouter);
app.use("/", userAuthRouter);
app.use("/files", express.static("./uploads"));

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

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
