const express = require("express");
const upload = require("../utils/cloudinary");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/getAllBlogs", blogController.getAllBlogs);
router.get("/:id", blogController.getBlog);
router.patch("/:id", upload.single("file"), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
router.post("/createBlog", upload.single("file"), blogController.createBlog);

module.exports = router;
