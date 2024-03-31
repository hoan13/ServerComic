const { AdminModel } = require("../models/AdminModel");

// Controller để xử lý quá trình đăng ký tài khoản admin
exports.registerAdmin = async (req, res, next) => {
  try {
    // Lấy thông tin từ body của request
    const { avatar, fullname, email, password } = req.body;

    // Kiểm tra xem email đã được sử dụng chưa
    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ error: "Email đã được sử dụng" });
    }

    // Tạo một bản ghi mới cho admin
    const newAdmin = new AdminModel({
      avatar: avatar || "",
      fullname,
      email,
      password,
    });

    // Lưu thông tin admin vào cơ sở dữ liệu
    await newAdmin.save();

    // Trả về kết quả thành công
    res.status(201).json({ message: "Đăng ký tài khoản admin thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng ký tài khoản admin:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi đăng ký tài khoản admin" });
  }
};

// Controller để xử lý quá trình đăng nhập
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Tìm kiếm admin theo email và mật khẩu
    const admin = await AdminModel.findOne({ email, password });

    // Kiểm tra xem admin có tồn tại và thông tin đăng nhập có chính xác không
    if (!admin) {
      return res
        .status(401)
        .json({ error: "Email hoặc mật khẩu không chính xác" });
    }

    // Lưu thông tin người dùng vào session
    // Tạo hoặc cập nhật thông tin phiên cho người dùng
    req.session.user = {
      isAdmin: true,
      adminId: admin._id,
      fullname: admin.fullname,
      avatar: admin.avatar,
    };

    // Chuyển hướng hoặc trả về kết quả thành công
    res.redirect("/home"); // Chuyển hướng đến trang home nếu đăng nhập thành công
    console.log("dn thanh cong");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi đăng nhập" });
  }
};
