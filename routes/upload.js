const express = require("express");
const path = require("path");
const multer = require("multer");
const validateOrigin = require("../middleware/validateOrigin");

const uploadFolder = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // specify the destination folder for uploaded files
const router = express.Router();

// Handle the file upload
router.post("/", upload.single("image"), (req, res, next) => {
  req.body.image = req.file;
  next();
});

router.post("/", validateOrigin, (req, res) => {
  res.json({ success: true, filename: req.body.image.filename });
});

module.exports = router;
