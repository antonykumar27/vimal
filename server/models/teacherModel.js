const mongoose = require('mongoose');

// Define the schema for the student
const teacherSchema = new mongoose.Schema({

  school: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "School", 
    required: true 
  },
  email: {
    type: String,
    required: true,
   
  },
 name: {
    type: String,
    required: true,
   
  },
  qualification: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  gender: {
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
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model based on the schema
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
