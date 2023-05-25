const Course = require("../models/course");
const Student = require("../models/student");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/////////checkAuthrization for student
const checkAuthrization = (req, res, next) => {
  let decoder = res.locals.decoder;
  //console.log(decoder);
  const cId = req.params.Cid;
  // console.log(cId);
  Course.findById(cId)
    .then((foundedCourse) => {
      sid = foundedCourse.student;
      useridlogedIn = decoder.result._id;
      for (s of sid) {
        if (s == useridlogedIn) {
          res.locals.foundedCourse = foundedCourse;
          next();
          return;
        } else {
          res.json({ msg: "sorry you are not authorized" });
        }
      }
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports = checkAuthrization;
