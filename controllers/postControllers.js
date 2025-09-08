const asyncHandler = require("express-async-handler");
const File = require("../models/File");
const Post = require("../models/Post");

const getPostForm = (req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    error: "",
    success: "",
  });
};

// create post
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!req.files || req.files.length == 0) {
    return res.render("newPost", {
      title: "Create Post",
      user: req.user,
      error: "At least on image is requires",
      success: "",
    });
  }

  //save the images into our database
  const images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });

      await newFile.save();

      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );

  const newPost = await Post.create({
    title,
    content,
    author: req.user._id,
    images,
  });

  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "Post created successfully",
    error: "",
  });
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");

  res.render("posts", {
    title: "Posts",
    user: req.user,
    posts,
    success: "",
    error: "",
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username",
  );

  res.render("postDetails", {
    title: "Posts",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

module.exports = {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
};
