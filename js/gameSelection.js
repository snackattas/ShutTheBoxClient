var play = require('./play.js')
var animation = require('./animation.js')
var _ = require('underscore')
var Promise = require('promise')

var game_selection = (function () {
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

	function init (passed_in_username, passed_in_user_exists) {
		resetVars()
		username = passed_in_username
		user_exists = passed_in_user_exists
		cacheDOM();
		renderGameSelection()
	}

	function newGameFormVariables () {
		$game_selection_form = $game_selection_shell.find("#game_selection_form")
		$dice_operation = $game_selection_form.find("#dice_operation")
		$number_of_tiles = $game_selection_form.find("#number_of_tiles")
		$addition_button = $dice_operation.find("#addition_button")
		$multiplication_button = $dice_operation.find("#multiplication_button")
		$nine_button = $number_of_tiles.find("#nine_button")
		$twelve_button = $number_of_tiles.find("#twelve_button")
		$new_game_button = $game_selection_form.find("#new_game_button")
	}

	function continueGameFormVariables () {
		$radio_buttons_collection = $game_selection_form.find(".game_radio_button")
		$continue_game_button = $game_selection_form.find("#continue_game_button")
		continue_game_present = true
	}

	function activateToggleButtons () {
		bindButtonPair($addition_button, $multiplication_button)
		bindButtonPair($nine_button, $twelve_button)
	}

	function cacheDOM () {
		var $body = $("body")
		$game_selection_shell = $($body).find(".game_selection_shell")
	}

	function renderGameSelection () {
		if (!user_exists) {
			renderNewGameForm();
		} else {
			findGamesPromise()
				.then( function () {
					if (open_games.length > 0) {
						renderContinueGameForm();
					} else {
						renderNewGameForm();
					}
				})
		}
	}

	function renderNewGameForm () {
		appendNewGameFormPromise().then(function () {
			newGameFormVariables()
			animation.animation.renderAddComponent($game_selection_form)
			activateToggleButtons();
			bindNewGameButton();
		})
	}

	function renderContinueGameForm () {
		appendContinueGameFormPromise()
			.then( function () {
				newGameFormVariables()
				continueGameFormVariables()
				animation.animation.renderAddComponent($game_selection_form)
				activateToggleButtons()
				bindRadioButtons()
				bindNewGameButton()
				bindContinueGameButton()
			})
	}

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

	function appendNewGameFormPromise () {
		return new Promise( function (resolve, reject) {
			ajax_callback_resolve = resolve
			$.ajax({
				url: "/new_game",
				success: function (json) {
					$($game_selection_shell).append(json.html)
					ajax_callback_resolve()
				}
			});
		});
	}

	function createGamePromise () {
		return new Promise(function (resolve, reject) {
			var new_game_object = {
				dice_operation:  dice_operation,
				number_of_tiles: number_of_tiles,
				username:        username
			}
			google_callback_resolve = resolve
			gapi.client.shut_the_box.new_game(new_game_object).execute(createNewGame)
		});
	}

	function createNewGame (resp) {
		if (!resp.code) {
			current_urlsafe_key = resp.urlsafe_key
		}
		google_callback_resolve();
	}

	function appendContinueGameFormPromise () {
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

	function findGamesPromise () {
		return new Promise(function (resolve, reject) {
			var find_games_object = {
				username:          username,
				games_in_progress: true
			};
			google_callback_resolve = resolve;
			gapi.client.shut_the_box.find_games(find_games_object).execute(addGames);
		})
	}

	function addGames (resp) {
		if (!resp.code) {
			if (resp.games) {
				_.each(resp.games, function (game) {
					open_games.push(game)
				});
			}
		};
		google_callback_resolve()
	}

	function whichFormRender () {
		if (open_games.length > 0) {
			this.renderContinueGame()
		} else {
			this.renderNewGame()
		}
	}

	function bindNewGameButton () {
		$new_game_button.on("click", renderNewGame)
	}

	function bindContinueGameButton () {
		$continue_game_button.on("click", renderContinueGame)
	}

	function unbindNewGameButton () {
		$new_game_button.unbind();
	}

	function unbindToggleButtons () {
		$addition_button.unbind();
		$multiplication_button.unbind();
		$nine_button.unbind();
		$twelve_button.unbind();
	}

	function unbindContinueGameButton () {
		$continue_game_button.unbind();
	}

	function unbindRadioButtons () {
		_.each($radio_buttons_collection, function (radio_button) {
			$(radio_button).unbind();
		});
	}

	function renderContinueGame ()  {
		setSelectedGameDetails();
		animation.animation.renderRemoveComponent($game_selection_form);
		unbindNewGameButton();
		unbindToggleButtons();
		unbindContinueGameButton();
		unbindRadioButtons();
		play.play.init(username, user_exists, current_urlsafe_key, dice_operation, number_of_tiles)
	}

	function setSelectedGameDetails () {
		var checked_radio = _.find($radio_buttons_collection, function (radio_button) {
			if ($(radio_button).attr("checked")) {
				return true
			};
		});
		current_urlsafe_key = $(checked_radio).data("urlsafe_key")
		dice_operation = $(checked_radio).data("dice_operation")
		number_of_tiles = $(checked_radio).data("number_of_tiles")
	}

	function bindButtonPair (button1, button2) {
		$(button1).on("click", function (e) {
			e.preventDefault()
			$(button1).addClass('active')
			$(button2).removeClass('active')
		});
		$(button2).on("click", function (e) {
			e.preventDefault()
			$(button2).addClass("active")
			$(button1).removeClass("active")
		})
	}

	function bindRadioButtons () {
		_.each($($radio_buttons_collection), function (radio_button) {
			var id = $(radio_button).attr("id")
			$(radio_button).on("click", {radio_button: radio_button}, toggleRadio)
		})
	}

	function toggleRadio (event) {
		_.each($($radio_buttons_collection), function (radio_button) {
			$(radio_button).removeAttr("checked")
		});
		$(event.data.radio_button).attr("checked", "checked")
	}
	return {
		init: init
	};
})()

module.exports.game_selection = game_selection
