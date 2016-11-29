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

app.get('/continue_game', function (req, res) {
  var games = req.param("games")
  var number_games = Object.keys(games).length
  app.render("continueGame", {games: games, number_games: number_games, layout: false}, function(err, html) {
    var response = {html: html}
    res.send(response)
  });
});

app.get('/new_game', function (req, res) {
  console.log('in new game')
  app.render('newGame', {layout: false}, function(err, html) {
    var response = {html: html}
    res.send(response)
  })
})
app.get('/tiles', function (req, res) {
  console.log('in tiles')
  var number_of_tiles = req.param("number_of_tiles")
  var active_tiles = req.param("active_tiles")
  if (number_of_tiles == 'NINE') {
    app.render("9Tiles", {layout: false, active_tiles: active_tiles}, function(err, html) {
      var response = {html: html}
      res.send(response)
    });
  }
  if (number_of_tiles == 'TWELVE') {
    app.render("12Tiles", {layout: false, active_tiles: active_tiles}, function(err, html) {
      var response = {html: html}
      res.send(response)
    });
  }
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
