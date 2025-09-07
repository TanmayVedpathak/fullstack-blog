const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");

// render register page
const getRegister = (req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
};

// register logic
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.register("register", {
        title: "Register",
        user: username,
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    res.render("render", {
      title: "Register",
      user: username,
      error: error.message,
    });
  }
};

// render login page
const getLogin = (req, res) => {
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
};

// login logic
const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
};

// logout logic
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
};

module.exports = {
  getRegister,
  register,
  getLogin,
  login,
  logout,
};
