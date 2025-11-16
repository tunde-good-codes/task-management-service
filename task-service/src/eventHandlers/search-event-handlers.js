const Task = require("../models/Task");
const logger = require("../utils/logger");

async function handlePostCreated(event) {
  try {
    const newTaskPost = new Task({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newTaskPost.save();
    logger.info(
      `Task post created: ${event.postId}, ${newTaskPost._id.toString()}`
    );
  } catch (e) {
    logger.error(e, "Error handling post creation event");
  }
}

async function handlePostDeleted(event) {
  try {
    await Task.findOneAndDelete({ postId: event.postId });
    logger.info(`Task post deleted: ${event.postId}}`);
  } catch (error) {
    logger.error(error, "Error handling post deletion event");
  }
}

module.exports = { handlePostCreated, handlePostDeleted };
