const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerUser,
  getAllUsers,
  getUserById,
  loginUser,
} = require("../controllers/userController");

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
// Route để xử lý yêu cầu đăng ký tài khoản user
router.post("/addUser", upload.single("avatar"), registerUser);
router.get("/getAlluser", getAllUsers);
router.get("/getUserById/:id", getUserById);
router.post("/login", loginUser);

module.exports = router;
