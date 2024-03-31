const mongoose = require("./db");

const userSchema = new mongoose.Schema({
  avatar: { type: String }, // Avatar ảnh
  username: { type: String, unique: true }, // Tên người dùng
  password: { type: String }, // Mật khẩu
  email: { type: String, unique: true }, // Email
  followedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }], // Các truyện đang theo dõi
  isVIP: { type: String, enum: ["Yes", "No"], default: "No" }, // Có phải VIP
  joinDate: { type: Date }, // Ngày tham gia
  vipExpirationDate: { type: Date }, // Ngày hết hạn VIP
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ], // Các thông báo
  vipPurchaseDate: { type: Date }, // Ngày mua VIP
  accountBalance: { type: Number, default: 0 }, // Số dư tài khoản, mặc định là 0
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
