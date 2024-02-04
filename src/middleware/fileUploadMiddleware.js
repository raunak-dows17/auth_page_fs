const multer = require("multer");
const fs = require("fs");
const path = require("path");

const fileUploadMiddleware = (req, res, next) => {
  const uploadFolder = path.join(
    __dirname,
    "../../database/uploads/profilePictures"
  );

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  return upload.single("profilePicture");
};

module.exports = fileUploadMiddleware;
