const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
const jwt = require("jsonwebtoken");

const Course = require("../models/course");
const Student = require("../models/student");
const StudentController = require("../controller/StudentController");
const checkToken = require("../middleware/checkToken");

router.post("/register", StudentController.studentregister);
router.post("/login", StudentController.studentlogin);
router.patch(
  "/registerInCourse/:Cid",
  checkToken,
  StudentController.studentregisterInCourse
);

router.get(
  "/listStudentCourse",
  checkToken,
  StudentController.listStudentCourse
);

router.patch(
  "/RemoveStudentCourse/:Cid",
  checkToken,
  StudentController.removeStudentCourse
);
module.exports = router;
