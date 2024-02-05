const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const fileUploadMiddleware = () => {
  const storage = multer.memoryStorage();

  const upload = multer({ storage: storage });

  return upload.single("profilePicture");
};

module.exports = fileUploadMiddleware;
