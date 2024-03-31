const mongoose = require("mongoose");
const multer = require("multer");

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
const { User } = require("../models/UserModel");

// Controller để xử lý quá trình đăng ký tài khoản người dùng
exports.registerUser = async (req, res, next) => {
  try {
    // Lấy thông tin từ body của request
    const { username, password, email } = req.body;

    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email đã được sử dụng" });
    }

    const avatar = req.file ? req.file.filename : null;

    // Tạo một bản ghi mới cho người dùng
    const newUser = new User({
      avatar, // Sử dụng tên tệp hình ảnh được tải lên
      username,
      password,
      email,
      isVIP: "No", // Mặc định là No
      accountBalance: 0, // Mặc định là 0
      joinDate: "", // Ngày tham gia: ngày hiện tại
      vipExpirationDate: "", // Không có ngày hết hạn VIP ban đầu
      notifications: [], // Không có thông báo ban đầu
      vipPurchaseDate: "", // Không có ngày mua VIP ban đầu
      followedStories: [], // Không có truyện đang theo dõi ban đầu
    });

    // Lưu thông tin người dùng vào cơ sở dữ liệu
    await newUser.save();
    // Middleware để xử lý tải lên tệp ảnh

    // Tạo đường dẫn đầy đủ của ảnh dựa trên tên tệp đã lưu
    const imagePath = `${req.protocol}://${req.get("host")}/images/${avatar}`;

    // Trả về kết quả thành công
    res
      .status(201)
      .json({ message: "Đăng ký tài khoản người dùng thành công", imagePath });
  } catch (error) {
    console.error("Lỗi khi đăng ký tài khoản người dùng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi đăng ký tài khoản người dùng" });
  }
};
exports.uploadImage = upload.single("avatar");
// Controller get by id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem id có phải là một ObjectId hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Id không hợp lệ" });
    }

    // Tìm người dùng dựa trên id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    // Trả về thông tin người dùng
    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy thông tin người dùng" });
  }
};

// Controller để lấy thông tin tất cả người dùng
exports.getAllUsers = async (req, res, next) => {
  try {
    // Lấy danh sách tất cả người dùng từ cơ sở dữ liệu
    const users = await User.find();

    // Trả về danh sách người dùng
    res.status(200).json({ users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy danh sách người dùng" });
  }
};

// Controller để xử lý quá trình đăng nhập người dùng
exports.loginUser = async (req, res, next) => {
  try {
    // Lấy thông tin từ body của request
    const { email, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu bằng email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email không tồn tại" });
    }

    // Kiểm tra mật khẩu
    if (user.password !== password) {
      return res.status(401).json({ error: "Mật khẩu không chính xác" });
    }

    // Đăng nhập thành công, trả về thông tin người dùng
    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi đăng nhập người dùng:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập người dùng" });
  }
};
