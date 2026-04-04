const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderEmail: { type: String },
    senderName: { type: String },
    text: { type: String, required: true },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ NEW
  },
  { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)