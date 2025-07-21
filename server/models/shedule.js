const mongoose = require('mongoose');

// Define the schema for the student
const sheduleSchema = new mongoose.Schema({

  school: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "School", 
    required: true 
  },
  shedule_name: {
    type: String,
    required: true,
   
  },
 class_Name: {
    type: String,
    required: true,
   
  },
 
  gender: {
    type: String,
    required: true,
   
  },
  name: {
    type: String,
    required: true,
   
  },
 
  age: {
    type: String,
    required: true,
   
  },
  gardien: {
    type: String,
    required: true,
   
  },
  gardien_phone: {
    type: String,
    required: true,
   
  },
  image: {
    type: String,
    required: true,
   
  },
  password: {
    type: String,
    required: true,
   
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model based on the schema
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
