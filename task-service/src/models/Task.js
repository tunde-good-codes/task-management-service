const mongoose = require("mongoose");

const taskPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

taskPostSchema.index({ createdAt: -1 });

const Task = mongoose.model("Task", taskPostSchema);
module.exports = Task;
