const express = require("express");

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/fetch-subreddit-posts", postController.fetchSubredditPosts);
router.get("/getAllPosts", postController.getAllPosts);
router.get("/get-posts/:subreddit", postController.getSubredditPosts);
router.delete("/delete-posts", postController.deleteSubredditPosts);

module.exports = router;
