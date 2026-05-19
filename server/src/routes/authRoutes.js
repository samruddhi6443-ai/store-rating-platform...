const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, updatePassword } = require("../controllers/authController");

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

router.post("/register", upload.single("storePhoto"), register);
router.post("/login", login);
router.put("/password", authMiddleware, updatePassword);

module.exports = router;
