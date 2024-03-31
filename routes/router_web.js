const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session"); // Thêm dòng này để import middleware session

const { Story } = require("../models/StoryModel");
const { User } = require("../models/UserModel");
// const { User } = require("../models/UserModel");
// Middleware để phục vụ các tệp tĩnh từ thư mục "public"
router.use(express.static("public"));

// Middleware để phục vụ các tệp tĩnh từ thư mục "Images"
router.use("/Images", express.static(path.join(__dirname, "../Images")));

// Thêm middleware session vào routerweb
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/login", (req, res) => {
  res.render("../views/loginScreen.ejs");
});

router.get("/register", (req, res) => {
  res.render("../views/registerScreen.ejs");
});

// Middleware kiểm tra xem người dùng có phải là admin hay không
const isAdmin = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập và là admin hay không
  if (req.session && req.session.user && req.session.user.isAdmin) {
    // Nếu là admin, chuyển tiếp yêu cầu
    next();
  } else {
    // Nếu không phải admin, chuyển hướng đến trang đăng nhập
    res.redirect("/login");
  }
};
router.get("/home", isAdmin, (req, res) => {
  res.render("../views/HomeScreen.ejs", { session: req.session });
});

router.get("/addlist", isAdmin, (req, res) => {
  res.render("../views/Storys/AddStoryScreen.ejs", {
    session: req.session,
  });
});

router.get("/adduser", isAdmin, (req, res) => {
  res.render("../views/Users/AddUserScreen.ejs", {
    session: req.session,
  });
});

// user
// router.get("/listuser", isAdmin, (req, res) => {
//   res.render("../views/Users/ListUserScreen.ejs", {
//     session: req.session,
//   });
// });

router.get("/listuser", isAdmin, async (req, res) => {
  try {
    const user = await User.find();
    res.render("../views/Users/ListUserScreen.ejs", {
      user: user,
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi truy xuất dữ liệu câu chuyện1." });
  }
});

// story
router.get("/liststory", isAdmin, async (req, res) => {
  try {
    const stories = await Story.find(); // Tải tất cả câu chuyện từ cơ sở dữ liệu
    res.render("../views/Storys/ListStoryScreen.ejs", {
      stories: stories, // Truyền danh sách câu chuyện đến trang hiển thị
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi truy xuất dữ liệu câu chuyện." });
  }
});
// Route hiển thị trang sửa thông tin câu chuyện
router.get("/editstory/:id", isAdmin, async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy câu chuyện" });
    }
    res.render("../views/Storys/UpdateStoryScreen.ejs", {
      story,
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi tải trang sửa câu chuyện" });
  }
});
// Route hiển thị trang chi tiết câu chuyện
router.get("/detailStory/:id", isAdmin, async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId); // Sử dụng findById để tìm câu chuyện với ID

    if (!story) {
      return res
        .status(404)
        .render("error", { message: "Không tìm thấy truyện" });
    }

    res.render("../views/Storys/DetailStoryScreen.ejs", {
      storyId,
      session: req.session,
    });
    console.log(storyId);
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải trang chi tiết truyện",
    });
  }
});

// profile
router.get("/changepass", isAdmin, (req, res) => {
  res.render("../views/profiles/ChangePassScreen.ejs", {
    session: req.session,
  });
});

router.get("/profile", isAdmin, (req, res) => {
  res.render("../views/profiles/ProfileScreen.ejs", {
    session: req.session,
  });
});

router.get("/settings", isAdmin, (req, res) => {
  res.render("../views/profiles/SettingScreen.ejs", {
    session: req.session,
  });
});

module.exports = router;
