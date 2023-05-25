const Course = require("../models/course");

const checkAuth = (req, res, next) => {
  const CId = req.params.id;
  useridlogedIn = req.session.userId;
  console.log(useridlogedIn);
  ///const adminId = "646d1dae8583bd49dc20d30b";
  Course.findById(CId)
    .then((foundedCourse) => {
      instructorIds = foundedCourse.creatorInstructor;

      console.log(instructorIds);
      if (req.session.role == "admin") {
        next();
        return;
      } else {
        for (i of instructorIds) {
          if (i == useridlogedIn) {
            next();
            return;
          } else {
            res.redirect("/Instructor/login");
          }
        }
      }
      ///
    })
    .catch((err) => {
      res.send({ err });
    });
};

module.exports = checkAuth;
