const mongoose = require('mongoose');

// Define the schema for the student
const schoolSchema = new mongoose.Schema({

  school_name: {
    type: String,
    required: true,
    
  },
 email: {
    type: String,
    required: true,
    trim: true,
  },
  owner_name: {
    type: String,
    required: true,
    trim: true,
  },
 schoolImage: {
    type: string,
    required: true,
   
  },
  password: {
    type: string, 
    
    required: true 
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model based on the schema
const School = mongoose.model('School', schoolSchema);

module.exports =School;
