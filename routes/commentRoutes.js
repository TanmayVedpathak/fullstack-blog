const express = require("express");
const { ensureAuthenticate } = require("../middlewares/auth");
const { addComment } = require("../controllers/commentControllers");

const commentRoutes = express.Router();

commentRoutes.post("/posts/:id/comments", ensureAuthenticate, addComment);

module.exports = commentRoutes;
