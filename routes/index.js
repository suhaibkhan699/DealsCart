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

// update deals
router.get("/updateDeals", forwardAuthenticated, async (req, res) => {
  res.render("dealsHome", {
    task: globalVars.offers,
  });
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const { id, name } = req.user;
  const dashboardTasks = await Task.find()
    .sort({ date: "desc" })
    .lean();

  res.render("dashboard", {
    name,
    id,
    task: dashboardTasks,
  });
});

module.exports = router;
