const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const {ensureAuthenticated} = require('../helpers/auth');

// Load Library Model
require('../models/Library');
const Library = mongoose.model('libraries');

// Library Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Library.find({user: req.user.id})
    .sort({date:'desc'})
    .then(libraries => {
      res.render('libraries/index', {
        libraries:libraries
      });
    });
});

// Add library Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('libraries/add');
});

// Edit Library Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Library.findOne({
    _id: req.params.id
  })
  .then(library => {
    if(library.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/libraries');
    } else {
      res.render('libraries/edit', {
        library:library
      });
    }
    
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.book_title){
    errors.push({text:'Please add a book title'});
  }
  if(!req.body.publication_year){
    errors.push({text:'Please add some publication year'});
  }
  if(!req.body.language){
    errors.push({text:'Please add some language'});
  }
  if(!req.body.no_of_copies){
    errors.push({text:'Please add some no of copies'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      book_title: req.body.book_title,
      publication_year: req.body.publication_year,
      language: req.body.language,
      no_of_copies: req.body.no_of_copies
    });
  } else {
    const newUser = {
      book_title: req.body.book_title,
      publication_year: req.body.publication_year,
      language: req.body.language,
      no_of_copies: req.body.no_of_copies,
      user: req.user.id
    }
    new Library(newUser)
      .save()
      .then(library => {
        req.flash('success_msg', 'Videaideo  added');
        res.redirect('/libraries');
      })
  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Library.findOne({
    _id: req.params.id
  })
  .then(library => {
    // new values
    
    library.book_title = req.body.book_title;
    library.publication_year = req.body.publication_year;
    library.language = req.body.language;
    library.no_of_copies = req.body.no_of_copies;

    library.save()
      .then(library => {
        req.flash('success_msg', 'Book Data Updated');
        res.redirect('/libraries');
      })
  });
});

// Delete Library
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Library.deleteOne({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Book data removed');
      res.redirect('/libraries');
    });
});



module.exports = router;