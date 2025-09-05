const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // primary key
    ref: "User", // mongoose.model("User", userSchema);
  },
  students: {
    type: [String], // 一個string 組成的array
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);
