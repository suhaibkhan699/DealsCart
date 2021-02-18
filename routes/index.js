const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Task = require("../models/Task");
const globalVars = require("../helpers/globalVars");

// Welcome Page
router.get("/", forwardAuthenticated, async (req, res) => {
  var tasks = await Task.find().sort({ date: "desc" }).lean();
  globalVars.offers = tasks;
  res.render("dealsHome", {
    task: tasks,
  });
});

//delete deal
router.get("/deleteDeal/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
});

// update deals
router.get("/updateDeals", forwardAuthenticated, async (req, res) => {
  res.render("dealsHome", {
    task: globalVars.offers,
  });
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const { id, name } = req.user;
  const dashboardTasks = await Task.find().sort({ date: "desc" }).lean();

  globalVars.offers = dashboardTasks;

  res.render("dashboard", {
    name,
    id,
    task: dashboardTasks,
  });
});

module.exports = router;
