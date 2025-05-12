// routes/uploadRoutes.js
// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { cloudinary, storage } = require("../utils/cloudinary");
const router = express.Router();

const upload = multer({ storage });

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = req.files.map(file => file.path);
    console.log("Uploaded files:", urls); // Debug log

    res.json({ 
      success: true,
      images: urls 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error uploading files",
      error: error.message 
    });
  }
});

module.exports = router;

