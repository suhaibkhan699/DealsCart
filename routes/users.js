const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
const Task = require("../models/Task");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const globalVars = require("../helpers/globalVars");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  //res.render("register")
  res.redirect("/")
);

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errorFlag = false;

  if (!name || !email || !password || !password2) {
    errorFlag = true;
  }

  if (password != password2) {
    errorFlag = true;
  }

  if (password.length < 6) {
    errorFlag = true;
  }

  if (errorFlag) {
    res.render("register", {
      msg: "Please enter valid details",
    });
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return res.render("register", {
          msg: "User already registered",
        });
      }

      const newUser = new User({
        name,
        email,
        password,
      });

      // encypt password
      const salt = await bcrypt.genSalt(10);

      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      globalVars.topLoginMsg =
        "Registered Successfully! Please Login to continue.";

      res.redirect("/users/login");
    } catch (err) {
      console.error(err);
    }
  }
});

// add task
router.post("/addTask", ensureAuthenticated, async (req, res) => {
  const { task } = req.body;
  const user = req.body.id;
  try {
    if (task.length == 0) {
      return res.redirect("/dashboard");
    }
    const newTask = new Task({
      task,
      user,
    });
    req.body.user = req.user.id;
    await Task.create(req.body);
    globalVars.offerAdded = !globalVars.offerAdded;
    //const tasks = await Task.find({ user: req.user.id }).lean();
    const tasks = await Task.find().sort({ date: "desc" }).lean();
    globalVars.offers = tasks;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
  })(req, res, next);
});

// Logout
router.get("/logout", ensureAuthenticated, async (req, res) => {
  await req.logout();
  res.redirect("/users/login");
});

// Delete user
router.get("/remove/:id", ensureAuthenticated, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await req.logout();
  res.redirect("/");
});

module.exports = router;
