const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
} = require("../controllers/postControllers");
const upload = require("../config/multer");
const { ensureAuthenticate } = require("../middlewares/auth");

const postRoutes = express.Router();

// get post form
postRoutes.get("/add", getPostForm);

// post submit logic
postRoutes.post(
  "/add",
  ensureAuthenticate,
  upload.array("images", 5),
  createPost,
);

// get all posts
postRoutes.get("/", getPosts);

// get post by id
postRoutes.get("/:id", getPostById);

// get edit post form
postRoutes.get("/:id/edit", getEditPostForm);

// update post
postRoutes.put(
  "/:id",
  ensureAuthenticate,
  upload.array("images", 5),
  updatePost,
);

// delete post
postRoutes.delete("/:id", ensureAuthenticate, deletePost);

module.exports = postRoutes;
