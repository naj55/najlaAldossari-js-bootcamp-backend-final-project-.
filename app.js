const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = Number(process.env.salt);
const jwt = require("jsonwebtoken");
var session = require("express-session");
var cookieParser = require("cookie-parser");
//app.use("/", express.static("./node_modules/bootstrap/dist/"));
app.use("/public/img/", express.static("public/img"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.secret,
  })
);

//connect to DB
mongoose
  .connect(process.env.db_url)
  .then(() => {
    console.log("db working");
  })
  .catch(() => {
    console.log("db not working");
  });

//test the server
app.get("/", (req, res) => {
  res.send("hello world");
});

///instructor route
const instructorRouter = require("./router/InstructorRouter");
app.use("/Instructor", instructorRouter);

///Student route
const studentRouter = require("./router/studentRouter");
app.use("/Student", studentRouter);

///Principal route
const principalRouter = require("./router/principalRouter");
app.use("/Principal", principalRouter);

/////// server to listen  /////
app.listen(8000, () => {
  console.log("server is listining");
});
