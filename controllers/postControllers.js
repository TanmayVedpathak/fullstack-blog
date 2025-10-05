const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const File = require("../models/File");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comments");

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

  if (!req.files || req.files.length === 0) {
    return res.render("newPost", {
      title: "Create Post",
      user: req.user,
      error: "At least one image is required",
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

  // Create new post
  const newPost = await Post.create({
    title,
    content,
    author: req.user._id,
    images,
  });

  // Update the user to add this post reference
  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { posts: newPost._id } },
    { new: true },
  );

  res.redirect("/posts");
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render("error", {
      title: "Error",
      error: "Page not found",
      user: req.user,
    });
  }

  const post = await Post.findById(id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });

  if (!post) {
    return res.render("error", {
      title: "Error",
      error: "Page not found",
      user: req.user,
    });
  }

  res.render("postDetails", {
    title: "Posts",
    user: req.user,
    post,
    success: "",
    error: "",
  });
});

// get edit post form
const getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("editPost", {
      title: "Post",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editPost", {
    title: "Edit Post",
    post,
    user: req.user,
    error: "",
    success: "",
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.render("postDetails", {
      title: "Posts",
      user: req.user,
      post,
      success: "",
      error: "Post not found",
    });
  }

  if (post.author.toString() != req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Posts",
      user: req.user,
      post,
      success: "",
      error: "Not authorized to edit",
    });
  }

  if (req.files) {
    await Promise.all(
      post.images.map(async (file) => {
        await cloudinary.uploader.destroy(file.public_id);
      }),
    );

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
    post.images = images;
  }

  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();

  res.redirect(`/posts/${post._id}`);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments");

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Page not found",
      success: "",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }

  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id);
    }),
  );

  await File.deleteMany({ uploaded_by: post.author });

  await Comment.deleteMany({ post: post._id });

  await User.findByIdAndUpdate(post.author, {
    $pull: { posts: post._id },
  });

  await Post.findByIdAndDelete(req.params.id);

  res.redirect("/posts");
});

module.exports = {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
};
