const mongoose = require("./db");

const commentSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID người dùng
  content: { type: String }, // Nội dung bình luận
  created_at: { type: Date, default: Date.now }, // Ngày tạo
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
