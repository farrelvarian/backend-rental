const userModel = require("../models/users");
const helpers = require("../helpers/helpers");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "../../uploads");
const { v4: uuidv4 } = require("uuid");


const getAllUser = (req, res, next) => {

    userModel
      .getAllUser()
      .then((result) => {
        const users = result;
        helpers.response(res, "Success get data", users, 200);
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Not found user", null, 404);
      });

};

const getUser = (req, res, next) => {
 
    const id = req.params.id;
    userModel
      .getUser(id)
      .then((result) => {
        const users = result;
        helpers.response(res, "Success get data", users, 200);
      })
      .catch((error) => {
        console.log(error);
        const err = new createError.InternalServerError();
        next(err);
      });

};

const insertUser = (req, res, next) => {
 
    const fileName = req.file.filename;
    const urlFileName = `${process.env.BASE_URL}/files/${req.file.filename}`;
    const {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      address,
    } = req.body;
    const data = {
      id: uuidv4(),
      name: name,
      email: email,
      password: password,
      image: urlFileName,
      phone: phone,
      gender: gender,
      dateOfBirth: dateOfBirth,
      address: address,
      createdAt: new Date(),
    };

    userModel
      .insertUser(data)
      .then(() => {
        helpers.response(res, "Success insert data", data, 200);
      })
      .catch((error) => {
        console.log(error);
        helpers.response(res, "Not found id user", null, 404);
        fs.unlink(`${dirPath}/${fileName}`, (err) => {
          if (err) {
            console.log("Error unlink image user!" + err);
          }
        });
      });

};

const updateUser = (req, res) => {

    const id = req.params.id;
    let avatar = "";
    let imageUserInput = "";

    if (!req.file) {
      imageUserInput = "";
    } else {
      imageUserInput = req.file.filename;
    }

    userModel.getUser(id).then((result) => {
      const oldImageUser = result[0].image;

      const newImageUser = `${process.env.BASE_URL}/files/${imageUserInput}`;
      const {
        name,
        email,
        password,
        phone,
        gender,
        dateOfBirth,
        address
      } = req.body;
      if (imageUserInput == "") {
        avatar = oldImageUser;
      } else {
        avatar = newImageUser;
      }
      const data = {
        name: name,
        email: email,
        password: password,
        image: avatar,
        phone: phone,
        gender: gender,
        dateOfBirth: dateOfBirth,
        address: address,
        updatedAt: new Date(),
      };
      userModel
        .updateUser(id, data)
        .then(() => {
          helpers.response(res, "Success update data", data, 200);
          if (avatar === oldImageUser) {
            console.log("no change on image!");
          } else {
            fs.unlink(`${dirPath}/${oldImageUser.substr(28)}`, (err) => {
              if (err) {
                console.log("Error unlink image vehicle!" + err);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          helpers.response(res, "Not found id user", null, 404);
          fs.unlink(`${dirPath}/${imageUserInput}`, (err) => {
            if (err) {
              console.log("Error unlink image vehicle!" + err);
            }
          });
        });
    });

};

const deleteUser = (req, res) => {

    const id = req.params.id;
    userModel
      .deleteUser(id)
      .then(() => {
        helpers.response(res, "Success delete data", id, 200);
      })
      .catch((err) => {
        console.log(err);
        helpers.response(res, "Not found id user", null, 404);
      });

};

module.exports = {
  getAllUser,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};
