const checkloginBySession = (req, res, next) => {
  const instructorId = req.session.userId;
  if (!req.session.userId) {
    res.redirect("/Instructor/login");
  } else {
    next();
  }
};

module.exports = checkloginBySession;
