const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: {
      url: String,
      filename: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  blogId: {
    type: String,
    unique: [true, "blog id must be unique"],
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
});

// Create the model from the schema and export it
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
