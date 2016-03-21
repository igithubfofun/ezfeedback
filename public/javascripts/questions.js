// $(function(){

//   var info = '/confidential/';

//   $.ajax({
//       url: info,
//       method: "GET",
//       data:{},
//       dataType: "json"
//   })
//   .done(function(data){
//     // console.log(data);
//     console.log(data[0].questions);
//   })
//   .fail(function() {
//     console.log("error");
//   })
//   .always(function() {
//     console.log("complete");
//   });



//   $('#question_form').on('submit', function(e) {
//     var q1 = $('#question1').val();
//     var q2 = $('#question2').val();
//     var q3 = $('#question3').val();
//     var q4 = $('#question4').val();

//     $.ajax({
//       url: info,
//       method: "POST",
//       data: {
//         questions: [q1, q2, q3, q4]
//       },
//       dataType: "json"
//     })
//     .done(function(data){
//       console.log(data);
//       window.location.href = "/";

//     })
//     .fail(function(){
//       console.log("error");
//     })
//     .always(function(){
//       console.log("complete");
//     })
//     // saveQuestions();
//     // window.location = "/questions";
//   })

//   // var saveQuestions = function(){
//   // }

// })
