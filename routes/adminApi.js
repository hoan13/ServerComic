const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/adminController");

// Route để xử lý yêu cầu đăng ký tài khoản admin
router.post("/reg", registerAdmin);

// Tuyến đường POST để xử lý đăng nhập
router.post("/login", loginAdmin);

module.exports = router;
