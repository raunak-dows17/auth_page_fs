const fs = require("fs");
const path = require("path");

const FileController = {
  getImageFile: (req, res) => {
    const filename = req.params.filename;
    const filePath = path
      .join(__dirname, "../../database/uploads/profilePictures", filename)
      .toString();

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        message: "File not found",
      });
    }
  },
};

module.exports = FileController;
