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

router.use(
  session({
    secret: process.env.secret,
  })
);

router.get("/createPrincipalOnce", PrincipalController.createOnce);
router.get("/login", PrincipalController.getlogin);
router.post("/login", PrincipalController.postlogin);
router.get("/coursesList", (req, res) => {
  Course.find().then((course) => {
    res.render("AllCourse", { course });
  });
});

router.get("/AttachedCourse", PrincipalController.getAttachedCourse);
router.post("/AttachedCourse", PrincipalController.postAttachedCourse);

// router.post("/Edit/:id", PrincipalController.postEdit);
// router.post("/Edit/:id", PrincipalController.getEdit);
// router.post("/Edit/:id", PrincipalController.postEdit);
router.get("/AddCourse/:id", PrincipalController.getAddCourse);

module.exports = router;
