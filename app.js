const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/authRoutes");
const passportConfig = require("./config/passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ! Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// ! EJS
app.set("view engine", "ejs");

// ! Routes
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
});

app.use("/auth", authRoutes);

// ! start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongo DB connect successfully");
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting mongodb");
  });
