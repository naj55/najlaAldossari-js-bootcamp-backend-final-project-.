const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidatore = require("mongoose-unique-validator");
const instructorSchema = new schema(
  {
    username: { type: String, require: true, unique: true },
    fullName: { type: String, require: true },
    password: { type: String, select: false, require: true },
    email: { type: String, unique: true },
    createdcourse: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    Taughtcourse: [
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
instructorSchema.plugin(uniqueValidatore);
const Instructor = mongoose.model("instructor", instructorSchema);
module.exports = Instructor;
