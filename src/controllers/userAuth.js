const userModels = require("../models/userAuth");
const { v4: uuidv4 } = require("uuid");
const helpers = require("../helpers/helpers");
const common = require("../helpers/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
  } = req.body;

  const user = await userModels.findUser(email);
  if (user.length > 0) {
    return helpers.response(res, "email sudah ada", null, 401);
  }
  console.log(user);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.

      const data = {
        id: uuidv4(),
        name: name,
        email: email,
        password: hash,
        role: role,
        status: "UNACTIVED",
        createdAt: new Date(),
      };

      console.log(data.id);
      userModels
        .insertUser(data)
        .then((result) => {
          delete data.password;
          jwt.sign(
            { email: data.email, role: data.role },
            process.env.SECRET_KEY,
            { expiresIn: "2h" },
            function (err, token) {
              common.sendEmail(data.email, data.name, token);
            }
          );
          helpers.response(res, "Success register", data, 200);
        })
        .catch((error) => {
          console.log(error);
          helpers.response(res, "error register", null, 500);
        });
    });
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await userModels.findUser(email);
  if(result.length===0){return helpers.response(res, "account registered yet", null, 401);}
  const user = result[0];
  console.log(user);
  const status = user.status;
  if (status == "ACTIVED") {
    bcrypt.compare(password, user.password, function (err, resCompare) {
      if (!resCompare) {
        return helpers.response(res, "password wrong", null, 401);
      }

      // generate token
      jwt.sign(
        { email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" },
        function (err, token) {
          // console.log(token);
          // console.log(process.env.SECRET_KEY);
          delete user.password;
          user.token = token;
          // res.cookie("token", token, {
          //   httpOnly: true,
          //   max: 1000 * 60 *60* 24,
          //   secure: true,
          //   path: "/",
          //   sameSite: "strict",
          // });
          //   res.cookie("user_id", user.id, {
          //     max: 1000 * 60 * 60 * 24,
          //     // secure: true,
          //     path: "/",
          //     // sameSite: "strict",
          //   });
          //     res.cookie("user_role", user.role, {
          //       max: 1000 * 60 * 60 * 24,
          //       // secure: true,
          //       path: "/",
          //       // sameSite: "strict",
          //     });
          //     res.cookie("user_image", user.image, {
          //       max: 1000 * 60 * 60 * 24,
          //       // secure: true,
          //       path: "/",
          //       // sameSite: "strict",
          //     });
          //      res.cookie("user_isAuth", true, {
          //        max: 1000 * 60 * 60 * 24,
          //        // secure: true,
          //        path: "/",
          //        // sameSite: "strict",
          //      });
          helpers.response(res, "success login", user, 200);
        }
      );
    });
  } else {
    return helpers.response(res, "account not actived", null, 401);
  }
};

const activation = (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    const error = new Error("server need token");
    error.code = 401;
    return next(error);
  }
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      helpers.response(res, "Activation failed", null, 401);
    }
    const email = decoded.email;
    const role = decoded.role;
    userModels
      .activationUser(email)
      .then(() => {
        // alert(`Activation Sucessful`)
        res.redirect(`${process.env.FRONT_URL}/${role}/login`);
      })

      .catch((error) => {
        helpers.response(res, "failed change status", null, 401);
      });
  });
};


module.exports = {
  register,
  login,
  activation,
}
