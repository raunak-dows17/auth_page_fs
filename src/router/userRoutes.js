const FileController = require("../controller/fileController");
const UserController = require("../controller/userController");
const authenticateUser = require("../middleware/AuthMiddleware");
const fileUploadMiddleware = require("../middleware/fileUploadMiddlware");

const router = require("express").Router();

router.post("/register", fileUploadMiddleware(), UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile/:id", authenticateUser, UserController.userProfile);
router.get("/profileImage/:filename", authenticateUser, FileController.getImageFile);

module.exports = router;
