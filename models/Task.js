const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  prodName: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  dealPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  }
  // expireAt: {
  //   type: Date,
  //   default: Date.now,
  //   expires: 100000,
  // },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
