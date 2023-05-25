const express = require("express");
const router = express.Router();
const Instructor = require("../models/Instructor");
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
var session = require("express-session");
var cookieParser = require("cookie-parser");
const Course = require("../models/course");
const checkloginBySession = require("../middleware/checkloginBySession");
const checkAuth = require("../middleware/checkAuth");
const InstructorController = require("../controller/InstructorController");
router.use(cookieParser());

router.use(
  session({
    secret: process.env.secret,
  })
);

router.get("/register", InstructorController.getregister);

router.post("/register", InstructorController.postregister);

router.get("/login", InstructorController.getlogin);

router.post("/login", InstructorController.postlogin);

router.get(
  "/AddCourse",
  checkloginBySession,
  InstructorController.getAddCourse
);

router.post(
  "/AddCourse",
  checkloginBySession,
  InstructorController.postAddCourse
);

router.get(
  "/Delete/:id",
  checkloginBySession,
  checkAuth,
  InstructorController.getdelete
);

router.get(
  "/Edit/:id",
  checkloginBySession,
  checkAuth,
  InstructorController.getEdit
);

router.post(
  "/Edit/:id",
  checkloginBySession,
  checkAuth,
  InstructorController.postEdit
);

router.get(
  "/Details/:id",
  checkloginBySession,
  checkAuth,
  InstructorController.getDetails
);

router.get(
  "/myCourseList",
  checkloginBySession,
  InstructorController.getmyCourseList
);

router.get("/logout", InstructorController.getlogout);

module.exports = router;
