const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true // e.g., "Grocery List"
  },
  content: { 
    type: String, 
    required: true // e.g., "Mango, Potato, Tomato"
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);