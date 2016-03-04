var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Answer = require('../models/answer');
var tempid;

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  User.findOne({ _id: req.session.userID}, function(err, user) {
    if (err) throw err;
    console.log('home', user);
  res.render('index', {name: user.name} )
  // console.log(user.name);
  // res.send('hi');
  })
});


router.get('/signup', function(req, res) {
  res.render('signup');
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
  req.session.userID = newUser._Id;
  tempid = req.session.userID;
  res.redirect('/questions');

})

router.get('/login', function(req,res){
  res.render('login');
});

router.post('/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  // var hash;

//multiple attempts with bcrypt, plan on working it out to salt and hash the current pw and match with pw in db
  User.findOne({ email: email}, function(err, user) {
    if (err) throw err;

    dbPassword = user.password;

    // test a matching password
    // user.comparePassword(user.password, function(err, isMatch) {
    //     if (err) throw err;

    //     // console.log(hashedPw);
    //     console.log('hello ' + user.password, isMatch); // -> Password123: true
    // });
    if (dbPassword === password){
      console.log('success');

      req.session.userID = user._id;


      // console.log(req.session.user);
      // console.log(req.session);

      res.redirect('/questions')
    }

    else {
      console.log('fail');
      res.redirect('/login');
    }

    // bcrypt.compare(password, hash, function(err, same) {
    //   console.log(password + ' ' + hash)
    //   console.log(same);
    // });

    // bcrypt.compare('hi', user.password, function(err, res) {
    //   console.log('fail')
    // });

    // test a failing password
    // user.comparePassword('123Password', function(err, isMatch) {
    //     if (err) throw err;
    //     console.log('123Password:', isMatch); // -> 123Password: false
    // });
  });

  // bcrypt.compare(password, hash, function(err, res) {
  //     console.log('fail')
  // });

  // User.findOne({ email: email}, function(err, user) {
  //   if (err) throw err;

  //   user.comparePassword(hashedPw, user.password, function(err, isMatch) {
  //     console.log(password);
  //     console.log(user.password);
  //     if (err) console.log('error');
  //       if (isMatch){
  //         console.log(password, isMatch);
  //         // req.session.userId = user._id;

  //       }

  //   });
  // });
});

router.get('/feedback', isAuthenticated, function(req,res){

  console.log('here', req.session.userID);
  Answer.find({ id: req.session.userID}, "answer1 answer2 answer3 answer4", function(err, answers){
    res.render('responses', {answer: answers})
  });
  // res.send('hi')
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
  res.render('questions');
})


router.post('/questions', isAuthenticated, function(req,res){
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
    res.send('Survey Sent!')
})


// router.get('/surveyquestions', isAuthenticated, function(req,res){
//   User.find({email: req.session.user.email}, function(err,results){
//     console.log(results[0].questions);
//       res.render('surveyquestions', {question: results[0].questions});
//   })
// })



router.get('/:surveyName', function(req, res) {
  User.findOne({surveyName: req.params.surveyName}, function(err, user) {
    if (err) {
      console.log(err);
      throw err;
    }
    // console.log(user._id);
    tempid = req.session.userID;
    // console.log(user[0].questions);
    console.log('survey name', user);
    res.render('answerquestions', {question: user.questions});
    // console.log(user[0].questions)
  });
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
    res.send('Survey Sent!')
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




//middleware for checking if user is authenticated, if not then redirect to login
function isAuthenticated(req, res, next) {
  if (!req.session.userID) {
    res.redirect('/login');
  }
  User.findOne({ _id: req.session.userID}, function(err, user) {
    if (err) {
      res.redirect('/login');
    }
    req.session.user = user;
    next();
  });
}


module.exports = router;
