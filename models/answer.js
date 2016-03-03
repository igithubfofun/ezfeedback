var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var answerSchema = new mongoose.Schema({
  answer1: {type: String},
  answer2: {type: String},
  answer3: {type: String},
  answer4: {type: String},
  id: {type: String},
  created_at: Date,
  updated_at: Date
});

var Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
