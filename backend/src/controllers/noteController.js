const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user.id // From your protect middleware
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};