const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addStory,
  getAllStories,
  getStoryById,
  deleteStory,
  updateStory,
  addChapter,
} = require("../controllers/storyController");
const { uploadChapterPDF } = require("../controllers/storyController");

// Cấu hình multer để lưu tệp ảnh vào thư mục public/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".png"); // Sử dụng phần mở rộng .png cho tệp ảnh
  },
});

const upload = multer({ storage: storage });
// exports.uploadChapterPDF = upload.single("pdfFile");
router.post("/addstory", upload.single("coverImage"), addStory);
router.get("/getallstory", getAllStories);
router.get("/get/:id", getStoryById);
router.get("/deleteStory/:id", deleteStory);
router.put("/updateStory/:id", upload.single("coverImage"), updateStory);
router.post("/story/:id/chapters", uploadChapterPDF, addChapter);

module.exports = router;
