const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
var session = require("express-session");
var cookieParser = require("cookie-parser");
const Course = require("../models/course");
const Instructor = require("../models/Instructor");
const Principal = require("../models/Principal");
const checkloginBySession = require("../middleware/checkloginBySession");
const PrincipalController = require("../controller/PrincipalController");
router.use(cookieParser());
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));

exports.createOnce = async (req, res) => {
  const username = "Admin";
  const password = "secret";
  const hash = await bcrypt.hash(password, salt);
  const admin = new Principal({
    username: username,
    password: hash,
  });
  admin
    .save()
    .then(() => {
      res.redirect("/Principal/AllCourses");
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getlogin = (req, res) => {
  res.render("adminlogin.ejs");
};

exports.postlogin = async (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  Principal.findOne({ username: userName })
    .select("+password")
    .then(async (result) => {
      const hashedPass = result.password;
      const compare = await bcrypt.compare(password, hashedPass);
      if (compare) {
        req.session.userId = result._id;
        req.session.role = "admin";
        const Id = req.session.userId;
        console.log(Id);
        res.redirect("/Principal/coursesList");
      } else {
        res.redirect("/Principal/login");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getAttachedCourse = (req, res) => {
  Instructor.find()
    .then((Instructors) => {
      Course.find().then((Courses) => {
        console.log(Instructors + " " + Courses);
        res.render("InstructorAttachCourse.ejs", { Instructors, Courses });
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.postAttachedCourse = (req, res) => {
  const instructor = req.body.Instructor;
  const course = req.body.Course;

  Instructor.findById(instructor).then((foundedInstructors) => {
    foundedInstructors.Taughtcourse.push(course);
    foundedInstructors.save().then((savedInstructor) => {
      Course.findById(course).then((foundedCourse) => {
        foundedCourse.teacherInstructor.push(instructor);
        foundedCourse.save().then(() => {});
      });
    });
  });
  res.redirect("/Principal/AttachedCourse");
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
      Principal.findById(req.session.userId).then((founded) => {
        founded.createdcourse.push(result._id);
        founded.save().then(() => {
          res.redirect("/Principal/myCourseList");
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
      res.redirect("/Principal/myCourseList");
    })
    .catch((err) => {
      res.send(err);
    });
};
