var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
  res.redirect('/');
})

module.exports = router;
