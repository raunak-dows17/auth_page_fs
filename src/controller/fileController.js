const cloudinary = require("cloudinary").v2;

const getImageFile = (req, res) => {
  const filename = req.params.filename;

  // Serve image from Cloudinary
  cloudinary.url(
    `profile_pictures/${filename}`,
    { secure: true, type: "fetch" },
    (error, url) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Internal server error",
        });
      }
      res.redirect(url);
    }
  );
};

module.exports = {
  getImageFile,
};
