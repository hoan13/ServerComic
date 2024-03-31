const Comment = require("../models/CommentModel");
// Controller để tạo một comment mới
exports.createComment = async (req, res, next) => {
  try {
    const { storyId, userId, content } = req.body;

    // Tạo một bản ghi mới cho comment
    const newComment = new Comment({
      storyId,
      userId,
      content,
    });

    // Lưu comment vào cơ sở dữ liệu
    await newComment.save();

    res.status(201).json({ message: "Comment đã được tạo thành công" });
  } catch (error) {
    console.error("Lỗi khi tạo comment:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tạo comment" });
  }
};

// Controller để lấy tất cả các comment của một story
exports.getCommentsByStoryId = async (req, res, next) => {
  try {
    const { storyId } = req.params;

    // Lấy tất cả các comment của một story dựa trên storyId
    const comments = await Comment.find({ storyId }).populate("userId");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Lỗi khi lấy comment của story:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy comment của story" });
  }
};
