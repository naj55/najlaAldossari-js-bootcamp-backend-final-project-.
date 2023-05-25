const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidatore = require("mongoose-unique-validator");
const principalSchema = new schema(
  {
    username: { type: String, require: true, unique: true },
    password: { type: String, select: false, require: true },
    createdcourse: [
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
principalSchema.plugin(uniqueValidatore);
const Principal = mongoose.model("principal", principalSchema);
module.exports = Principal;
