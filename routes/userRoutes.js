const express = require("express");
const User = require("../models/User");
const {
  getUserProfile,
  getEditProfileForm,
  deleteUserAccount,
  updateUserProfile,
} = require("../controllers/userControllers");
const { ensureAuthenticate } = require("../middlewares/auth");
const upload = require("../config/multer");

const userRoutes = express.Router();

//Render login page
userRoutes.get("/profile", ensureAuthenticate, getUserProfile);

//Render edit profile page
userRoutes.get("/edit", ensureAuthenticate, getEditProfileForm);

userRoutes.post("/delete", ensureAuthenticate, deleteUserAccount);

userRoutes.post(
  "/edit",
  ensureAuthenticate,
  upload.single("profilePicture"),
  updateUserProfile,
);

module.exports = userRoutes;
