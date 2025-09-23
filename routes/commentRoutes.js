const express = require("express");
const { ensureAuthenticate } = require("../middlewares/auth");
const {
  addComment,
  getCommentForm,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");

const commentRoutes = express.Router();

// add comment
commentRoutes.post("/posts/:id/comments", ensureAuthenticate, addComment);

// get comment form
commentRoutes.get("/comments/:id/edit", getCommentForm);

// update comment
commentRoutes.put("/comments/:id", ensureAuthenticate, updateComment);

// delete comment
commentRoutes.delete("/comments/:id", ensureAuthenticate, deleteComment);

module.exports = commentRoutes;
