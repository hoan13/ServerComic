const mongoose = require("./db");

const notificationSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID Người dùng
  storyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
  }, // ID Truyện
  chapter: { type: Number }, // Chương
  isRead: { type: Boolean, default: false }, // Đã đọc
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
