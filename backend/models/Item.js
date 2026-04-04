const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String },
    location: { type: String },
    desc: { type: String },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String },
    userName: { type: String },
    status: { type: String, default: "active" }, // active | resolved
  },
  { timestamps: true }
)

module.exports = mongoose.model("Item", itemSchema)