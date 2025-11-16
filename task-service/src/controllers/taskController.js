const Task = require("../models/Task");
const logger = require("../utils/logger");
const { publishEvent } = require("../utils/rabbitMq");



const createTask = async (req, res) => {
  logger.info("hitting registration endpoint for user");
  try {
    const { title, description, userId } = req.body;

    let task = new Task({title, description, userId });
    await task.save();

      await publishEvent("task.created", { taskId: task._id, userId });

    logger.info("task registered successfully", task._id);

    res.status(201).json({
      success: true,
      message: "task registered successfully",
      data: task,
    });
  } catch (e) {
    logger.error("failed to registered task: " +  e);
    res.status(400).json({
      success: false,
      message: "internal server error",
    });
  }
};



const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      throw new Error("failed to get Tasks");
    }

    res.status(200).json({
      success: true,
      message: "data fetched successfully ",
      data: tasks,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "internal server error",
    });
  }
};
module.exports = {  createTask, getTasks };
