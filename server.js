var express = require('express')
var app = express()


app.set('views', "./views/")
app.set('view engine', 'pug')
app.use(express.static('./'))

app.get('/', function (req, res) {
  res.render('main')
})

app.get('/continue_game', function (req, res) {
  var games = req.param("games")
  var number_games = Object.keys(games).length
  var render_object = {
    games: games,
    number_games: number_games,
    layout: false
  }
  app.render("continueGame", render_object, function(err, html) {
    var response = {html: html}
    res.send(response)
  });
});

app.get('/new_game', function (req, res) {
  app.render('newGame', {layout: false}, function(err, html) {
    var response = {html: html}
    res.send(response)
  })
})

app.get('/tiles', function (req, res) {
  var number_of_tiles = req.param("number_of_tiles")
  var render_object = {
    number_of_tiles: number_of_tiles,
    layout: false
  }
  app.render("tiles", render_object, function(err, html) {
    var response = {html: html}
    res.send(response)
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
