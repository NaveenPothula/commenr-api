const dotenv = require("dotenv");

const { v2: cloudinary } = require("cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//let storage;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "commentr",
    format: async (req, file) => file.mimetype.split("/")[1], // Auto-detect the file format
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

module.exports = upload;
