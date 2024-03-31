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
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/pdfFile/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".pdf"); // Sử dụng phần mở rộng .pdf cho tệp PDF
  },
});

const pdfUpload = multer({ storage: pdfStorage });
const upload = multer({ storage: storage });
exports.uploadChapterPDF = pdfUpload.single("pdfFile");
const { Story } = require("../models/StoryModel");

exports.addStory = async (req, res, next) => {
  try {
    // Lấy thông tin từ body của request
    const {
      title,
      author,
      genre,
      description,
      status,
      yearPublished,
      isHot,
      isVIP,
    } = req.body;

    const existingStory = await Story.findOne({ title }); // Tìm câu chuyện đã tồn tại với title tương tự

    if (existingStory) {
      return res.status(400).json({ error: "Title đã tồn tại" }); // Trả về lỗi nếu title đã tồn tại
    }

    // Lấy tên tệp ảnh đã tải lên từ req.file
    const coverImage = req.file ? req.file.filename : null;

    const newStory = new Story({
      title,
      author,
      genre,
      description,
      status,
      coverImage,
      yearPublished,
      isHot,
      isVIP,
      notifications: [],
      comments: [],
      chapters: [],
    });

    // Lưu story mới vào cơ sở dữ liệu
    await newStory.save();

    // Tạo đường dẫn đầy đủ của ảnh dựa trên tên tệp đã lưu
    const imagePath = `${req.protocol}://${req.get(
      "host"
    )}/images/${coverImage}`;

    // Trả về kết quả thành công cùng với đường dẫn của ảnh
    res.status(201).json({ message: "Thêm truyện thành công", imagePath });
  } catch (error) {
    console.error("Lỗi khi thêm truyện:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thêm truyện" });
  }
};

// Middleware để xử lý tải lên tệp ảnh
exports.uploadImage = upload.single("coverImage");

// getAll data
exports.getAllStories = async (req, res, next) => {
  try {
    // Lấy toàn bộ câu chuyện từ cơ sở dữ liệu
    const stories = await Story.find();

    res.status(200).json(stories); // Trả về danh sách các câu chuyện
  } catch (error) {
    console.error("Lỗi khi lấy danh sách câu chuyện:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy danh sách câu chuyện" });
  }
};

// Xoá câu chuyện dựa trên ID
exports.deleteStory = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Lấy ID của câu chuyện từ request parameters

    // Xoá câu chuyện từ cơ sở dữ liệu
    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ message: "Xoá câu chuyện thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá câu chuyện:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xoá câu chuyện" });
  }
};

// Sửa thông tin của câu chuyện dựa trên ID
exports.updateStory = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Lấy ID của câu chuyện từ request parameters
    const updatedData = req.body; // Lấy thông tin cập nhật từ body của request

    // Kiểm tra xem request body có chứa trường coverImage hay không
    if (req.file) {
      // Nếu có, chỉ cập nhật trường coverImage
      updatedData.coverImage = req.file.filename;
    }

    // Sử dụng findByIdAndUpdate để cập nhật thông tin của câu chuyện
    // Thêm option { new: true } để trả về đối tượng câu chuyện đã được cập nhật
    const updatedStory = await Story.findByIdAndUpdate(storyId, updatedData, {
      new: true,
    });

    if (!updatedStory) {
      // Nếu không tìm thấy câu chuyện cần cập nhật, trả về lỗi 404 Not Found
      return res.status(404).json({ error: "Không tìm thấy câu chuyện" });
    }

    res
      .status(200)
      .json({ message: "Cập nhật câu chuyện thành công", updatedStory });
  } catch (error) {
    console.error("Lỗi khi cập nhật câu chuyện:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật câu chuyện" });
  }
};

// Route GET để lấy câu chuyện theo ID
exports.getStoryById = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Lấy ID của câu chuyện từ request parameters

    // Sử dụng findById để tìm câu chuyện trong cơ sở dữ liệu
    const story = await Story.findById(storyId);

    // Kiểm tra xem câu chuyện có tồn tại không
    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy câu chuyện" });
    }

    // Nếu tìm thấy câu chuyện, trả về dữ liệu của câu chuyện
    res.status(200).json(story);
  } catch (error) {
    console.error("Lỗi khi lấy câu chuyện theo ID:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy câu chuyện" });
  }
};
// them chapter
exports.addChapter = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Lấy ID của câu chuyện từ request parameters
    const { chap } = req.body; // Lấy thông tin chương từ body của request

    // Kiểm tra xem câu chuyện tồn tại không
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy câu chuyện" });
    }

    // Kiểm tra xem số chương đã tồn tại chưa
    const existingChapter = story.chapters.find(
      (chapter) => chapter.chap === chap
    );
    if (existingChapter) {
      return res.status(400).json({ error: "Số chương đã tồn tại" });
    }

    // Lấy tên tệp PDF đã tải lên từ req.file
    const pdfFile = req.file ? req.file.filename : null;

    // Thêm chương mới vào câu chuyện
    story.chapters.push({ chap, pdfFile });
    await story.save();

    // Tạo đường dẫn đầy đủ của tệp PDF
    const pdfPath = `${req.protocol}://${req.get("host")}/pdfFile/${pdfFile}`;

    res.status(201).json({ message: "Thêm chương thành công", pdfPath });
  } catch (error) {
    console.error("Lỗi khi thêm chương:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thêm chương" });
  }
};

// get chapter
exports.getChaptersByStoryId = async (req, res, next) => {
  try {
    const storyId = req.params.id; // Lấy ID của câu chuyện từ request parameters

    // Sử dụng findById để tìm câu chuyện trong cơ sở dữ liệu
    const story = await Story.findById(storyId);

    // Kiểm tra xem câu chuyện có tồn tại không
    if (!story) {
      return res.status(404).json({ error: "Không tìm thấy câu chuyện" });
    }

    // Nếu tìm thấy câu chuyện, trả về danh sách các chương
    res.status(200).json(story.chapters);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách chương" });
  }
};
