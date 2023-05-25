const mongoose = require("mongoose");
const schema = mongoose.Schema;
const courseSchema = new schema({
  courseName: { type: String, require: true },
  courseDesc: String,
  start: { type: Date, require: true },
  end: { type: Date, require: true },
  creatorInstructor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
    },
  ],
  teacherInstructor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
    },
  ],
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
});

const Course = mongoose.model("course", courseSchema);
module.exports = Course;
