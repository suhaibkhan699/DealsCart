const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Task = require("../models/Task");
const globalVars = require("../helpers/globalVars");

// Welcome Page
router.get("/", forwardAuthenticated, async (req, res) => {
  var tasks = await Task.find().sort({ date: "desc" }).limit(84).lean();
  globalVars.offers = tasks;
  res.render("dealsHome", {
    task: tasks,
  });
});

//delete deal
router.get("/deleteDeal/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    const tasks = await Task.find().sort({ date: "desc" }).lean();
    globalVars.offers = tasks;
    globalVars.offerUpdated = !globalVars.offerUpdated;
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

// get offer updated status
router.get("/getStatus", forwardAuthenticated, async (req, res) => {
  if(globalVars.offerUpdated){
    globalVars.offerUpdated = !globalVars.offerUpdated;
    res.send("offer updated")
  }
  else{
    res.send("offer not updated")
  }
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const { id, name } = req.user;
  //below code is for local host, uncomment it to load only 5 deals
  //const dashboardTasks = await Task.find().sort({ date: "desc" }).limit(3).lean();

  //below code is for server, comment the below code for localhost
  const dashboardTasks = await Task.find().sort({ date: "desc" }).lean();

  globalVars.offers = dashboardTasks;

  res.render("dashboard", {
    name,
    id,
    task: dashboardTasks,
  });
});

module.exports = router;
