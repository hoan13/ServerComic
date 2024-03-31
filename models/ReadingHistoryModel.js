const mongoose = require("./db");

const readingHistorySchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID Người dùng
  storyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
  }, // ID Truyện
  chapter: { type: Number }, // Chương
  lastReadDate: { type: Date, default: Date.now }, // Ngày đọc cuối cùng
});

const ReadingHistory = mongoose.model("ReadingHistory", readingHistorySchema);

module.exports = ReadingHistory;
