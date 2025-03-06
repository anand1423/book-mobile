const mongoose = require("mongoose");
const partSchema = new mongoose.Schema(
  {
    partId: { type: String, required: true, unique: true },
    bookId: { type: String, required: true, ref: "Book" },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Part = mongoose.model("Part", partSchema);
module.exports = Part;
