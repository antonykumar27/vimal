const mongoose = require('mongoose');

// Define the schema for the student
const subjectSchema = new mongoose.Schema({

  school: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "School", 
    required: true 
  },
  subject_name: {
    type: String,
    required: true,
   
  },
 subject_codeName: {
    type: String,
    required: true,
   
  },
 
 
  
 
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model based on the schema
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
