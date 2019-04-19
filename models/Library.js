const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LibrarySchema = new Schema({
  book_title:{
    type: String,
    required: true
  },
  publication_year:{
    type: String,
    required: true
  },
  language:{
    type: String,
    required: true
  },
  no_of_copies:{
    type: Number,
    required: true
  },
  user:{
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('libraries', LibrarySchema);