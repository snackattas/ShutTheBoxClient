var express = require('express')
var app = express()


app.set('views', "./static/views")
app.set('view engine', 'pug')
app.use(express.static('./static/'))
// app.get('/', function (req, res) {
//   var globalscope;
//   function init() {
//   	var client  = gapi.client.init({apiKey: "AIzaSyBMSjlGdNyRCxBN4CfZe8MkIGEbAsT3QA0"})
//   	// gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
//   	// globalscope=gapi.client;
//   	globalscope=client
//   }
//   res.render("index")
// })
app.get('/', function (req, res) {
  res.render('main')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// app.post('/createuser', function (req, res) {
//   console.log('in createuser')
//   // console.log(req)
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// });

// var globalscope;
// function init() {
// 	var client  = gapi.client.init({apiKey: "AIzaSyBMSjlGdNyRCxBN4CfZe8MkIGEbAsT3QA0"})
// 	// gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
// 	// globalscope=gapi.client;
// 	globalscope=client
// }
