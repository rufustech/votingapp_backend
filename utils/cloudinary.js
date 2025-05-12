// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// console.log("Cloudinary ENV Check:", {
//   CLOUD_NAME: process.env.CLOUD_NAME,
//   CLOUD_KEY: process.env.CLOUD_KEY,
//   CLOUD_SECRET: process.env.CLOUD_SECRET,
// });


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "models",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: resize images
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `model-${uniqueSuffix}`;
    }
  }
});

module.exports = {
  cloudinary,
  storage,
};
