const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();


// Load routes
const libraries = require('./routes/libraries');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

const mongoUrl = 'mongodb+srv://Anup:lighteningstriker@cluster0-bmyzf.mongodb.net/test?retryWrites=true';
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(mongoUrl, {
  useNewUrlParser:true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Contactus Route
app.get('/contactUs', (req, res) => {
  res.render('contactUs');
});

// contactus post route
app.post('/send' , (req , res) => {
  const output = `
  <p> You have new contact request </p>
  <h1> Contact details </h1>
  <ul>
     <li> Name : ${req.body.name} </li>
     <li> Company : ${req.body.company} </li>
     <li> Email : ${req.body.email} </li>
     <li> Phone Number : ${req.body.phone} </li>
  </ul>
  <h2> message </h2>
  <p2> ${req.body.message} </p2>`;


let transporter = nodemailer.createTransport({
  service : 'Gmail',
  host : 'smtp.gmail.com',
  port : 587,
  secure : false,
  auth : {
    user : 'harishvelip58@gmail.com',
    pass : '9405215930'
  },
  tls : {
    rejectUnauthorized : false
  }
});

let mailOptions = {
  from : '"nodemailer" <harishvelip58@gmail.com>',
  to : 'harishvelip58@gmail.com',
  subject : 'Hello',
  text : 'Hello Harish',
  html : output
}

transporter.sendMail(mailOptions , (err , info) =>{
   if(err){
     console.log(err);
   }
  
     console.log('Message sent : %s' , info);
     console.log('Preveiw URL : %s' , nodemailer.getTestMessageUrl(info));

     res.render('contactUs' , {msg : 'Email has been sent'});
  
});
});



// Use routes
app.use('/libraries', libraries);
app.use('/users', users);

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});