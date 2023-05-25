const express = require("express");
const router = express.Router();
const Instructor = require("../models/Instructor");
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
var session = require("express-session");
var cookieParser = require("cookie-parser");
const Course = require("../models/course");

//////////controllers////////////
exports.getregister = (req, res) => {
  res.render("instructorRegisterForm.ejs");
};

exports.postregister = async (req, res) => {
  const username = req.body.username;
  const fullName = req.body.fullname;
  const password = req.body.password;
  const email = req.body.email;
  const hashedpass = await bcrypt.hash(password, salt);

  const newInstructor = new Instructor({
    username: username,
    fullName: fullName,
    password: hashedpass,
    email: email,
  });
  newInstructor
    .save()
    .then((result) => {
      res.redirect("/Instructor/myCourseList");
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getlogin = (req, res) => {
  res.render("LoginForm.ejs");
};

exports.postlogin = async (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  Instructor.findOne({ username: userName })
    .select("+password")
    .then(async (result) => {
      const hashedPass = result.password;
      const compare = await bcrypt.compare(password, hashedPass);
      if (compare) {
        req.session.userId = result._id;
        req.session.role = "instructor";
        const instructorId = req.session.userId;
        console.log(instructorId);
        res.redirect("/Instructor/myCourseList");
      } else {
        res.redirect("/Instructor/login");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getAddCourse = (req, res) => {
  res.render("addCourse.ejs");
};

exports.postAddCourse = (req, res) => {
  courseName = req.body.courseName;
  courseDesc = req.body.courseDesc;
  start = req.body.start;
  end = req.body.end;

  const newCourse = new Course({
    courseName: courseName,
    courseDesc: courseDesc,
    start: start,
    end: end,
    creatorInstructor: req.session.userId,
  });
  newCourse
    .save()
    .then((result) => {
      Instructor.findById(req.session.userId).then((foundedInstructor) => {
        foundedInstructor.createdcourse.push(result._id);
        foundedInstructor.save().then(() => {
          res.redirect("/Instructor/myCourseList");
        });
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getdelete = (req, res) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/Instructor/myCourseList");
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getEdit = (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then((course) => {
      res.render("updateCourse.ejs", { course });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.postEdit = (req, res) => {
  const id = req.params.id;
  const courseName1 = req.body.courseName;
  const courseDesc1 = req.body.courseDesc;
  const start1 = req.body.start;
  const end1 = req.body.end;

  Course.findById(id).then((result) => {
    result.courseName = courseName1;
    result.courseDesc = courseDesc1;
    result.start = start1;
    result.end = end1;

    result
      .save()
      .then(() => {
        res.redirect("/Instructor/myCourseList");
      })
      .catch((err) => {
        res.send(err);
      });
  });
};

exports.getDetails = (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then((course) => {
      res.render("showDetails.ejs", { course });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getmyCourseList = (req, res) => {
  Instructor.findById(req.session.userId)
    .populate("createdcourse")
    .then((result) => {
      const course = result.createdcourse;
      res.render("myCourseList.ejs", { course });
    });
};

exports.getlogout = (req, res) => {
  req.session.destroy();
  res.redirect("/Instructor/login");
};
