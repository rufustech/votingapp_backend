// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.array("images", 5), (req, res) => {
  const urls = req.files.map(file => file.path); // Cloudinary provides the URL in `file.path`
  res.json({ images: urls });
});

module.exports = router;
