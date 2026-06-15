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
    ...req.body
  });

  await task.save();

  res.json(task);

});

router.patch("/:id/complete", auth, async (req, res) => {

  const task = await Task.findByIdAndUpdate(
    req.params.id,
     {"completed": true}, 
     { returnDocument: "after" }
);
res.json(task);
});

router.delete("/:id", auth, async (req, res) => {

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted"
  });

});

 router.put('/:id', auth, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    if (task.completed) {
      return res.status(400).json({
        message: 'Completed tasks cannot be edited'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;