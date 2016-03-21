var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Answer = require('../models/answer');
var tempid;
var loginAttempt;

//wherever Answer has id of the current user then send that result to the responses view
router.get('/', isAuthenticated, function(req, res, next) {
  User.findOne({ _id: req.session.userID}, function(err, user) {
    Answer.find({ id: req.session.userID}, function(err, answers){
      if (err) console.log(err);
      res.render('responses', {user: req.session.user, answer: answers, name: user.name, business: user.businessName, surveyName: user.surveyName, questions: user.questions})
    });
  });
});

router.get('/signup', function(req, res) {
  res.render('signup', {user: req.session.user});
});

router.post('/signup', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var businessName = req.body.businessName;
  var surveyName = req.body.surveyName;

  var newUser = User({
      name: name,
      email: email,
      password: password,
      businessName: businessName,
      surveyName: surveyName
  });
    newUser.save(function(err) {
      if (err) console.log(err);
    });

    if (newUser) {
      req.session.userID = newUser._id;
    }

    res.redirect('/questions');
})

router.get('/login', function(req,res){
  res.render('login', {
    user: req.session.user
  });
});

router.post('/login', function(req, res){
  var email = req.body.email;
  var inputPassword = req.body.password;
  // var hash;

//multiple attempts with bcrypt, plan on working it out to salt and hash the current pw and match with pw in db
  User.findOne({ email: email}, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.redirect('/login');
    }
    else {

      dbPassword = user.password;

      user.comparePassword(inputPassword, function(err, isMatch) {
          if (err) throw err;
          if (isMatch === true){
            req.session.userID = user._id;
            res.redirect('/');
          }
          else {
            res.redirect('/login');
          }
      });
    }
  });

});

router.get('/confidential', isAuthenticated, function(req,res){
  User.find({_id: req.session.user._id}, function(err, results){
    res.status(200).json(results);
  })
});

router.post('/confidential', isAuthenticated, function(req,res){
  req.session.user.questions = req.body.questions;
  req.session.user.save();
  res.redirect('/');
})

router.get('/questions', isAuthenticated, function(req,res){
  console.log(req.session.userID);
  res.render('questions', {user: req.session.user});
})

var savedQuestions;
//looking up User by params of surveyname and displaying questions of that User.
router.get('/survey/:surveyName', function(req, res, next) {
  console.log(req.params.surveyName);
  User.findOne({surveyName: req.params.surveyName}, function(err, user) {
    if (err) console.log(err);
    savedQuestions = user.questions;
    console.log('questions: ', savedQuestions);
    tempid = user._id;
    // res.send('hi');
    res.render('answerquestions', {question: savedQuestions});
  })
  // next();
});

router.post('/thanks', function(req, res) {

  var a1 = req.body.ans1;
  var a2 = req.body.ans2;
  var a3 = req.body.ans3;
  var a4 = req.body.ans4;
  var id = tempid;

  var newAnswer = Answer({
      answer1: a1,
      answer2: a2,
      answer3: a3,
      answer4: a4,
      id: tempid
  });
    newAnswer.save(function(err) {
        if (err) console.log(err);

    });
    res.render('thanks')
});

router.get('/test', isAuthenticated, function(req, res){

  console.log(req.session.user);
  Answer.findOne({userID: userID}, function(err, answer) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(answer);
    // res.render('responses', {answer: answer[0]})
    res.send('hi')
  });
})

router.get('/logout', function(req,res, next){
  req.session.destroy();
  res.redirect('/login');
})

//middleware for checking if user is authenticated, if not then redirect to login
function isAuthenticated(req, res, next) {
  if (!req.session.userID) {
    res.redirect('/login');
  }
  else {
    User.findOne({ _id: req.session.userID}, function(err, user) {
      if (err) {
        res.redirect('/login');
      }
      req.session.user = user;
      next();
      });
  }
}


module.exports = router;
