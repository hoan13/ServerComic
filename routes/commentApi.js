const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByStoryId,
} = require("../controllers/commentController");

// Tuyến đường POST để tạo comment mới
router.post("/addComment", createComment);

// Tuyến đường GET để lấy tất cả các comment của một story dựa trên storyId
router.get("/getCommentsByStoryId/:storyId", getCommentsByStoryId);

module.exports = router;
