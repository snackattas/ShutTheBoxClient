var play = require('./play.js')
var animation = require('./animation.js')
var _ = require('underscore')
var Promise = require('promise')

var game_selection = (function () {
	//UP TO LINE 185 OCCURS BEFORE A GAME IS CHOSEN, THE REST OF THE FUNCTION
	//DEALS WITH WHAT HAPPENS AFTER A GAME IS CHOSEN
	//initialize variables
	var username
	var user_exists
	var current_urlsafe_key
	var open_games
	var dice_operation
	var number_of_tiles
	var continue_game_present
	var ajax_callback_resolve
	var google_callback_resolve
	var open_games

	var $game_selection_shell
	var $game_selection_form
	var $dice_operation
	var $number_of_tiles
	var $addition_button
	var $multiplication_button
	var $nine_button
	var $twelve_button
	var $new_game_button
	var $radio_buttons_collection
	var $continue_game_button

	// each time game_selection.init is called, the variables are re-initialized
	function resetVars () {
		username = new String();
		user_exists = false;
		current_urlsafe_key = new String();
		open_games = null;
		dice_operation = new String();
		number_of_tiles = new String();
		continue_game_present = false;
		ajax_callback_resolve = new Function()
		google_callback_resolve = new Function()
		open_games = new Array();
		$game_selection_shell = new Object();
		$game_selection_form = new Object();
		$dice_operation = new Object();
		$number_of_tiles = new Object();
		$addition_button = new Object();
		$multiplication_button = new Object();
		$nine_button = new Object();
		$twelve_button = new Object();
		$new_game_button = new Object();
		$radio_buttons_collection = new Object();
		$continue_game_button = new Object();
	}

	// main entrypoint for this object
	function init (passed_in_username, passed_in_user_exists) {
		resetVars()
		username = passed_in_username
		user_exists = passed_in_user_exists
		cacheDOM();
		newOrContinueGameForm()
	}

	// This just grabs the body and game_selection_shell.  Individual DOM components
	// will be cached later
	function cacheDOM () {
		var $body = $("body")
		$game_selection_shell = $($body).find(".game_selection_shell")
	}
	//The other caching functions
	function cacheNewGameFormDOM () {
		$game_selection_form = $game_selection_shell.find("#game_selection_form")
		$dice_operation = $game_selection_form.find("#dice_operation")
		$number_of_tiles = $game_selection_form.find("#number_of_tiles")
		$addition_button = $dice_operation.find("#addition_button")
		$multiplication_button = $dice_operation.find("#multiplication_button")
		$nine_button = $number_of_tiles.find("#nine_button")
		$twelve_button = $number_of_tiles.find("#twelve_button")
		$new_game_button = $game_selection_form.find("#new_game_button")
	}
	function cacheContinueGameFormDOM() {
		$radio_buttons_collection = $game_selection_form.find(".game_radio_button")
		$continue_game_button = $game_selection_form.find("#continue_game_button")
		continue_game_present = true
	}

	// This holds logic to determine if the New Game form or Continue game form should
	// be rendered
	function newOrContinueGameForm () {
		console.log('in new or continue game form')
		if (user_exists) {
			console.log('user exists')
			findGamesPromise()
			.then( function () {
				if (open_games.length > 0) {
					renderContinueGameForm();
				} else {
					renderNewGameForm();
				}
				})
		} else {
			console.log('user is new')
			renderNewGameForm();
		}
	}

	// These two render functions grab the forms from the server and initialize them
	function renderContinueGameForm () {
		ajaxContinueGameFormPromise()
			.then( function () {
				cacheNewGameFormDOM()
				cacheContinueGameFormDOM()
				bindToggleButtons()
				bindRadioButtons()
				bindNewGameButton()
				bindContinueGameButton()
				animation.animation.renderAddComponent($game_selection_form)
			})
	}
	function renderNewGameForm () {
		ajaxNewGameFormPromise().then(function () {
			cacheNewGameFormDOM()
			bindToggleButtons();
			bindNewGameButton();
			animation.animation.renderAddComponent($game_selection_form)
		})
	}

	//grabbing the forms from the server
	function ajaxContinueGameFormPromise () {
		return new Promise( function (resolve, reject) {
			var game_selection_object = {games: open_games}
			ajax_callback_resolve = resolve
			$.ajax({
				url: "/continue_game",
				datatype: "json",
				data: game_selection_object,
				success: function (json) {
					$($game_selection_shell).append(json.html)
					ajax_callback_resolve()
				}
			});
		})
	}

	function ajaxNewGameFormPromise () {
		console.log('in new game retrieval')
		return new Promise( function (resolve, reject) {
			ajax_callback_resolve = resolve
			$.ajax({
				url: "/new_game",
				success: function (json) {
					console.log('in new gamesuccess')
					$($game_selection_shell).append(json.html)
					ajax_callback_resolve()
				}
			});
		});
	}

	// checks if the user has any outstanding games in progress, and adds them to open_games array
	function findGamesPromise () {
		return new Promise(function (resolve, reject) {
			var find_games_object = {
				username:          username,
				games_in_progress: true
			};
			google_callback_resolve = resolve;
			gapi.client.shut_the_box.find_games(find_games_object).execute(findGamesPromiseCallback);
		})
	}
	function findGamesPromiseCallback (resp) {
		if (!resp.code) {
			if (resp.games) {
				_.each(resp.games, function (game) {
					open_games.push(game)
				});
			}
		};
		google_callback_resolve()
	}

	//THIS STUFF EXECUTES ONCE A USER CLICKS PLAY IN EITHER THE NEW GAME OR CONTINUE GAME FORM\

	function renderNewGame () {
		dice_operation = $dice_operation.find(".active").data().value
		number_of_tiles = $number_of_tiles.find(".active").data().value
		createGamePromise().then( function () {
			unbindToggleButtons();
			unbindNewGameButton();
			if (continue_game_present) {
				unbindContinueGameButton();
				unbindToggleButtons();
			}
			animation.animation.renderRemoveComponent($game_selection_form)
			play.play.init(username, user_exists,	current_urlsafe_key,
				dice_operation, number_of_tiles)
		})
	}

	function renderContinueGame ()  {
		findSelectedGame();
		unbindNewGameButton();
		unbindToggleButtons();
		unbindContinueGameButton();
		unbindRadioButtons();
		animation.animation.renderRemoveComponent($game_selection_form);
		play.play.init(username, user_exists, current_urlsafe_key, dice_operation, number_of_tiles)
	}

	function createGamePromise () {
		return new Promise(function (resolve, reject) {
			var new_game_object = {
				dice_operation:  dice_operation,
				number_of_tiles: number_of_tiles,
				username:        username
			}
			google_callback_resolve = resolve
			gapi.client.shut_the_box.new_game(new_game_object).execute(createGamePromiseCallback)
		});
	}
	function createGamePromiseCallback (resp) {
		if (!resp.code) {
			current_urlsafe_key = resp.urlsafe_key
		}
		google_callback_resolve();
	}

	function findSelectedGame () {
		var checked_radio = _.find($radio_buttons_collection, function (radio_button) {
			if ($(radio_button).attr("checked")) {
				return true
			};
		});
		current_urlsafe_key = $(checked_radio).data("urlsafe_key")
		dice_operation = $(checked_radio).data("dice_operation")
		number_of_tiles = $(checked_radio).data("number_of_tiles")
	}

	//binding and unbinding
	function bindToggleButtons () {
		bindButtonPair($addition_button, $multiplication_button)
		bindButtonPair($nine_button, $twelve_button)
	}
	function bindButtonPair (button1, button2) {
		$(button1).on("click", function (e) {
			// e.preventDefault()
			$(button1).addClass('active')
			$(button2).removeClass('active')
		});
		$(button2).on("click", function (e) {
			// e.preventDefault()
			$(button2).addClass("active")
			$(button1).removeClass("active")
		})
	}
	function unbindToggleButtons () {
		$addition_button.unbind();
		$multiplication_button.unbind();
		$nine_button.unbind();
		$twelve_button.unbind();
	}

	function bindNewGameButton () {
		$new_game_button.on("click", renderNewGame)
	}
	function unbindNewGameButton () {
		$new_game_button.unbind();
	}

	function bindContinueGameButton () {
		$continue_game_button.on("click", renderContinueGame)
	}
	function unbindContinueGameButton () {
		$continue_game_button.unbind();
	}

	function bindRadioButtons () {
		_.each($($radio_buttons_collection), function (radio_button) {
			var id = $(radio_button).attr("id")
			$(radio_button).on("click", {radio_button: radio_button}, bindRadioButtonsHelper)
		})
	}
	function bindRadioButtonsHelper (event) {
		_.each($($radio_buttons_collection), function (radio_button) {
			$(radio_button).removeAttr("checked")
		});
		$(event.data.radio_button).attr("checked", "checked")
	}
	function unbindRadioButtons () {
		_.each($radio_buttons_collection, function (radio_button) {
			$(radio_button).unbind();
		});
	}
	return {
		init: init
	};
})()

module.exports.game_selection = game_selection
