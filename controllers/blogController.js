const Blog = require("../models/Blog");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const generateId = require("../utils/generateId");

const generateUniqueId = async () => {
  const blogId = generateId(6);
  const userExistsWithBusinessId = await Blog.findOne({ blogId });
  if (userExistsWithBusinessId) {
    return generateUniqueId(); // Recursively generate a new ID if it already exists
  }
  return blogId;
};

exports.createBlog = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const { title, description, metaDescription, keywords } = req.body;

  const data = {};
  data.title = title;
  data.description = description;
  data.metaDescription = metaDescription;
  data.keywords = keywords;
  if (req.file) {
    const obj = {};
    obj.url = req.file.path;
    obj.filename = req.file.filename;
    data.image = obj;
  }
  console.log(data);

  const blogId = await generateUniqueId();
  data.blogId = blogId;

  const blog = await Blog.create(data);

  if (!blog) {
    return next(new AppError("blog was not created", 404));
  }

  res.status(200).json({
    status: "success",
    blog,
  });
});

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  if (!blogs) {
    return next(new AppError("blogs are not found"));
  }
  res.status(200).json({
    status: "success",
    blogs,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findOne({ title: id });
  if (!blog) {
    return next(new AppError("blog not found", 404));
  }
  res.status(200).json({
    status: "success",
    blog,
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  console.log(req.params.id);

  if (req.file) {
    const object = { url: req.file.path, filename: req.file.filename };
    req.body.image = object;
    console.log(req.body);
  }

  const id = req.params.id;
  const blog = await Blog.findOneAndUpdate({ blogId: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return next(new AppError("blog not found", 404));
  }
  console.log(blog);

  res.status(200).json({
    status: "success",
    blog,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const blog = await Blog.findOneAndDelete({ blogId: id });
  if (!blog) {
    return next(new AppError("blog not found", 404));
  }
  res.status(200).json({
    status: "success",
    blog,
  });
});
