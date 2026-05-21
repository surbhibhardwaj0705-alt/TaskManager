const express = require("express");

const Task = require("../models/Task");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {

  const tasks = await Task.find({
    user: req.user.id
  });

  res.json(tasks);

});

router.post("/", auth, async (req, res) => {

  const task = new Task({
    user: req.user.id,
    title: req.body.title
  });

  await task.save();

  res.json(task);

});

router.put("/:id", auth, async (req, res) => {

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.title = req.body.title || task.title;

  task.completed =
    req.body.completed ?? task.completed;

  await task.save();

  res.json(task);

});

router.delete("/:id", auth, async (req, res) => {

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted"
  });

});

router.put('/:id', async (req, res) => {

  try {

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;