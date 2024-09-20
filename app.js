const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const postController = require("./controllers/postController");
// const userController = require("./controllers/userController");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const faqRouter = require("./routes/faqRoutes");
const contactRouter = require("./routes/contactRoutes");
const blogRouter = require("./routes/blogRoutes");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend origin
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/faqs", faqRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/blogs", blogRouter);

// Connect to MongoDB

// app.post("/api/login", userController.getRedditAccessToken);
//app.get("/api/verify", userController.middleware);

// app.post(
//   "/api/fetch-posts",
//   userController.middleware,
//   postController.fetchPosts
// );

// app.delete(
//   "/api/delete-posts",
//   userController.middleware,
//   postController.deleteSubredditPosts
// );

// app.get("/api/posts", userController.middleware, postController.getPosts);

// app.get(
//   "/api/fetch-subreddits",
//   userController.middleware,
//   postController.getSubreddits
// );

// app.get(
//   "/api/get-posts/:subreddit",
//   userController.middleware,
//   postController.getSubredditPosts
// );

// app.post("/api/register", userController.Register);

//app.get("/api/verify", userController.middleware, userController.getUser);

//app.get("/api/logout", userController.middleware, userController.logout);

//app.post("/api/analyze", upload.single("file"), postController.getIcp);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello from server",
  });
});

app.all("*", (req, res, next) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  next(res.send("route not defined"));
});

app.use(globalErrorHandler);

module.exports = app;
