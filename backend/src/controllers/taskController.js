const Task = require('../models/Task');

// 1. Create a Task (Date is handled automatically)
exports.createTask = async (req, res) => {
  try {
    const { title, priority, description, date } = req.body;

    // We create the task and manually set the date to 'now'
    // req.user.id comes from your 'protect' middleware
    const task = await Task.create({
      title,
      priority,
      description,
      userId: req.user.id,
      date: new Date(date) // Forces today's date: 2026-03-25
    });

    res.status(201).json({ 
      success: true, 
      data: task 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 2. Get Tasks for a specific date (Day 1, Day 2 logic)
exports.getTasks = async (req, res) => {
  try {
    const { date } = req.query;

    // Convert to start and end of day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    res.json({ success: true, data: tasks });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // ⭐ THIS FIXES YOUR ISSUE
    );

    res.json({
      success: true,
      data: updatedTask
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};