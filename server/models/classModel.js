const mongoose = require('mongoose');

// Define the schema for the student
const classSchema = new mongoose.Schema({

  school: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "School", 
    required: true 
  },
  class_text: {
    type: String,
    required: true,
    trim: true,
  },
 class_number: {
    type: Number,
    required: true,
   
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Teacher", 
    required: true 
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model based on the schema
const Class = mongoose.model('Class', classSchema);

module.exports = Class;
