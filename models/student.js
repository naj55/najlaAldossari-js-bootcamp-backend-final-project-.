const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidatore = require("mongoose-unique-validator");
const studentSchema = new schema(
  {
    username: { type: String, require: true, unique: true },
    fullName: { type: String, require: true },
    password: { type: String, select: false, require: true },
    email: { type: String, unique: true },
    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

studentSchema.plugin(uniqueValidatore);
const Student = mongoose.model("student", studentSchema);
module.exports = Student;
