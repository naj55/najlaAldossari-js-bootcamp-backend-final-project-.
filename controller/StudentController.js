const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
const jwt = require("jsonwebtoken");
const Instructor = require("../models/Instructor");
const Course = require("../models/course");
const Student = require("../models/student");

exports.studentregister = async (req, res) => {
  const username = req.body.username;
  const fullName = req.body.fullName;
  const password = req.body.password;
  const email = req.body.email;

  const hashPass = await bcrypt.hash(password, salt);

  const newStudent = new Student({
    username: username,
    fullName: fullName,
    password: hashPass,
    email: email,
  });

  newStudent
    .save()
    .then((result) => {
      const token = jwt.sign({ result }, process.env.secret, {
        expiresIn: "1h",
      });
      res.json({ result: result, token: token });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.studentlogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Student.findOne({ username: username })
    .select("+password")
    .then(async (result) => {
      const hashedPass = result.password;
      const compare = await bcrypt.compare(password, hashedPass);

      if (compare) {
        const token = jwt.sign({ result }, process.env.secret, {
          expiresIn: "1h",
        });
        res.json({ token: token });
      } ///end if
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.studentregisterInCourse = (req, res) => {
  const student = res.locals.decoder;
  const Sid = student.result._id;
  const Cid = req.params.Cid;

  Student.findById(Sid)
    .then((student) => {
      student.course.push(Cid);
      student
        .save()
        .then((savedStudent) => {
          Course.findById(Cid).then((course) => {
            course.student.push(Sid);
            course.save().then(() => {
              res.json(savedStudent);
            });
          });
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.listStudentCourse = (req, res) => {
  const student = res.locals.decoder;
  const Sid = student.result._id;
  Student.findById(Sid).then((student) => {
    student
      .populate("course")
      .then((Scourse) => {
        res.json(Scourse);
      })
      .catch((err) => {
        res.json(err);
      })
      .catch((err) => {
        res.json(err);
      });
  });
};

exports.removeStudentCourse = (req, res) => {
  const student = res.locals.decoder;
  const Sid = student.result._id;
  const Cid = req.params.Cid;

  Student.findById(Sid)
    .then((student) => {
      student.course.pull(Cid);
      student
        .save()
        .then((savedStudent) => {
          res.json(savedStudent);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
};
