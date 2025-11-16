const express = require("express");
const { createTask, getTasks } = require("../controllers/taskController");

const router = express.Router();


router.post("/create-tasks", createTask);
router.get("/all-tasks", getTasks);

module.exports = router;
 