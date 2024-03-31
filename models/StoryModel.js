const mongoose = require("./db");

const chapterSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  chap: { type: String }, // Số chương
  pdfFile: { type: String }, // Đường dẫn tới tệp PDF của chương
});

const storySchema = new mongoose.Schema({
  title: { type: String }, // Tên truyện
  author: { type: String }, // Tác giả
  genre: { type: String }, // Thể loại
  description: { type: String }, // Mô tả
  status: { type: String, enum: ["Ongoing", "Completed"] }, // Tình trạng
  coverImage: { type: String }, // Ảnh bìa
  isHot: { type: Boolean, default: false }, // true nếu là nổi bật, false nếu không
  isVIP: { type: Boolean, default: false }, // true nếu là VIP, false nếu không
  chapters: [chapterSchema], // Thông tin về từng chương
  yearPublished: { type: String }, // Năm xuất bản
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ], // Các thông báo
});

const Story = mongoose.model("Story", storySchema);

module.exports = { Story };
