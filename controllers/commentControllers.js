const asyncHandler = require("express-async-handler");

const Post = require("../models/Post");
const Comment = require("../models/Comments");

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

  res.redirect(`/posts/${postId}`);
});

module.exports = { addComment };
