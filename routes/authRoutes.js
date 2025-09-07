const express = require("express");
const {
  getRegister,
  register,
  getLogin,
  login,
  logout,
} = require("../controllers/authControllers");

const authRoutes = express.Router();

authRoutes.get("/register", getRegister);

authRoutes.post("/register", register);

authRoutes.get("/login", getLogin);

authRoutes.post("/login", login);

authRoutes.get("/logout", logout);

module.exports = authRoutes;
