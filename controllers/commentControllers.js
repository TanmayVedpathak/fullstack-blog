const asyncHandler = require("express-async-handler");

const Post = require("../models/Post");
const Comment = require("../models/Comments");
const User = require("../models/User");

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "No post found",
    });
  }

  if (!content) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Comment cannot be empty",
    });
  }

  // save comment
  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  await comment.save();

  // push comment in post
  post.comments.push(comment._id);
  await post.save();

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { comments: comment._id } },
    { new: true },
  );

  res.redirect(`/posts/${postId}`);
});

// get comment form
const getCommentForm = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      post: "",
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }

  res.render("editComment", {
    title: "Comment",
    comment,
    user: req.user,
    error: "",
    success: "",
  });
});

// update comment
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      post: "",
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }

  if (comment.author._id.toString() !== req.user.id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post: "",
      user: req.user,
      error: "You are not authorized to edit this comment",
      success: "",
    });
  }

  comment.content = content || comment.content;

  await comment.save();

  res.redirect(`/posts/${comment.post}`);
});

// delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      post: "",
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }

  if (comment.author._id.toString() !== req.user.id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      post: "",
      user: req.user,
      error: "You are not authorized to edit this comment",
      success: "",
    });
  }

  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  await User.findByIdAndUpdate(comment.author, {
    $pull: { comments: comment._id },
  });

  await Comment.findByIdAndDelete(req.params.id);

  res.redirect(`/posts/${comment.post}`);
});

module.exports = { addComment, getCommentForm, updateComment, deleteComment };
