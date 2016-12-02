var game_selection = require('./gameSelection.js')
var animation = require('./animation.js')
var _ = require('underscore')
var Promise = require('promise')
var alertify = require('alertifyjs')

var play  = (function (){
	var username = new String()
	var user_exists
	var urlsafe_key
	var dice_operation
	var number_of_tiles
	var active_tiles
	var roll
	var second_dice_exists
	var valid_move
	var game_over

	var $gameplay_shell
	var $tile_container
	var $tiles
	var $dice_holder
	var $dice_holder_2
	var $button
	var $game_over_message

	var ajax_callback_resolve
	var google_callback_resolve

	function resetVars () {
		username = new String()
		user_exists = false;
		urlsafe_key = new String()
		dice_operation = new String()
		number_of_tiles = new String()
		active_tiles = new Array();
		roll = new Array();
		second_dice_exists = true;
		valid_move = false;
		game_over = false;

		$gameplay_shell = new Object();
		$tile_container = new Object();
		$tiles = new Object();
		$dice_holder = new Object();
		$dice_holder_2 = new Object();
		$button = new Object();
		$game_over_message = new Object();

		ajax_callback_resolve = new Function();
		google_callback_resolve = new Function();
	}
	function init (passed_in_username, passed_in_user_exists, passed_in_urlsafe_key,
		passed_in_dice_operation, passed_in_number_of_tiles) {
		// initialize passed in variables
		resetVars();
		username = passed_in_username
		user_exists = passed_in_user_exists
		urlsafe_key = passed_in_urlsafe_key
		dice_operation = passed_in_dice_operation
		number_of_tiles = passed_in_number_of_tiles

		cacheDOM()
		gameStatePromise()
		.then(appendTilesPromise)
		.then(function () {
			cacheGameplayDOM()
			animation.animation.renderAddComponent($tile_container);
			bindAllTiles();
			setGameState();
			bindRollButton();
		})
	}

	function cacheDOM () {
		$gameplay_shell = $(".gameplay_shell")
	}

	function cacheGameplayDOM () {
		$tile_container = $gameplay_shell.find("#tile_container")
		$tiles = $tile_container.find(".tile")
		$dice_holder = $tile_container.find(".dice_holder")
		$dice_holder_2 = $tile_container.find(".dice_holder_2")
		$button = $tile_container.find("#roll_button")
		$game_over_message = $tile_container.find("#game_over_text")
		$perfect_game = $tile_container.find("#perfect_game")
	}

	function gameStatePromise () {
		return new Promise(function (resolve, reject) {
			google_callback_resolve = resolve
			// call turn with only the urlsafe-key.  If it's a new game, it creates
			// the first roll.  If it's a continued game, it will return the last roll
			// and the active tiles in play, which we use to establish the continued game
			// state
			var turn_object = {urlsafe_key: urlsafe_key}
			gapi.client.shut_the_box.turn(turn_object).execute(setGameVariables)
		})
	}

	function setGameVariables (resp) {
		if (!resp.code) {
			active_tiles = resp.active_tiles
			roll = resp.roll
		}
		google_callback_resolve()
	}

	function appendTilesPromise () {
		var data_object = {number_of_tiles: number_of_tiles}
		return new Promise( function (resolve, reject) {
			ajax_callback_resolve = resolve
			$.ajax({
				url: "/tiles",
				datatype: 'json',
				data: data_object,
				success: function (json) {
					$gameplay_shell.append(json.html)
					ajax_callback_resolve()
				}
			});
		});
	}

	function bindAllTiles () {
		_.each($tiles, function (tile) {
			$(tile).on("click", {tile: tile}, tileAction)
		})
	}

	function setGameState () {
		_.each($tiles, function (tile) {
			var tile_number = extractTileNumber(tile)
			if (!(_.contains(active_tiles, tile_number))) {
				$(tile).click();
				flipTile(tile)
			}
		})
		startDice($dice_holder, roll[0])
		if (roll.length == 2) {
			startDice($dice_holder_2, roll[1])
		} else {
			removeSecondDice()
		}
	}

	function flipTile (tile) {
		$(tile).addClass("flipped").removeClass("temp_flipped")
		unbindTile(tile)
	}

	function startDice (dice, roll) {
		setTimeout(createFirstDice, 1000, dice)
		setTimeout(rollFirstDice, 1500, dice, roll)
	}

	function createFirstDice (dice) {
		$(dice).dice().css("display", "none")
	}

	function rollFirstDice (dice,roll) {
		$(dice).css("display", "")
		$(dice).dice('roll', roll);
	}

	function removeSecondDice () {
		$($dice_holder_2).remove();
		second_dice_exists = false;
	}

	function tileAction (event) {
		if ($(event.data.tile).hasClass("temp_flipped")) {
			// unflip the tile
			$(event.data.tile).css("transform","")
			$(event.data.tile).removeClass("temp_flipped")
		} else {
			// flip the tile
			$(event.data.tile).transition({
				y: '90px',
				perspective: '300px',
				rotate3d: '1,0,0,-140deg'
			})
			$(event.data.tile).addClass("temp_flipped")
		}
	}

	function bindRollButton () {
		$button.on("click", rollAction)
	}
	function unbindRollButton () {
		$button.unbind();
	}

	function rollAction () {
		checkTurn()
			.then(renderTurn)
	}

	function extractTileNumber (tile) {
		return String($(tile).find(".tile_number").data("number"))
	}

	function renderTurn () {
		if (game_over == true) {
			rollDice();
			unbindRollButton();
			unbindTiles();
			newGameOption();
		} else {
			if (valid_move) {
				valid_move = false;
				convertTempFlippedTiles();
				rollDice();
			} else {
				resetTempFlippedTiles();
				alertify.error('Improper move')
			}
		}
	}

	function newGameOption () {
		if (!roll) {
			$perfect_game.css("display","").addClass('animated fadeIn')
		} else {
			$game_over_message.css("display","").addClass('animated fadeIn')
		}
		var new_game_button = "<button class='ui button center aligned' id='play_again_button'>Play Again?</button>"
		$($button).replaceWith(new_game_button)
		$button = $tile_container.find("#play_again_button")
		bindNewGameButton();
	}

	function bindNewGameButton () {
		$button.on("click", startNewGame)
	}

	function unbindNewGameButton () {
		$button.unbind()
	}

	function startNewGame () {
		unbindNewGameButton();
		animation.animation.renderRemoveComponent($tile_container)
		game_selection.game_selection.init(username, user_exists)
	}

	function resetTempFlippedTiles () {
		_.each($tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				$(tile).click();
			}
		})
	}

	function rollDice () {
		if (!roll) {
			return
		}
		if (roll.length == 2) {
			$dice_holder.dice('roll', roll[0])
			$dice_holder_2.dice('roll', roll[1])
		} else {
			if (second_dice_exists) {
				removeSecondDice();
			}
			$dice_holder.dice('roll', roll[0])
			}
	}

	function convertTempFlippedTiles () {
		_.each($tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				flipTile(tile)
			}
		})
	}

	function checkTurn () {
		return new Promise( function(resolve, reject) {
			var flipped_tiles = new Array();
			_.each($tiles, function (tile) {
				if ($(tile).hasClass("temp_flipped")) {
					flipped_tiles.push(extractTileNumber(tile))
				}
			})
			if (flipped_tiles.length == 0) {
				valid_move = false;
				resolve()
			} else {
				var turn_object = {
					urlsafe_key: urlsafe_key,
					flip_tiles: flipped_tiles
				}
				google_callback_resolve = resolve
				gapi.client.shut_the_box.turn(turn_object).execute(setTurnVariables)
			}
		})
	}

	function setTurnVariables (resp) {
		if (resp) {
			if (resp.game_over) {
				roll = resp.roll
				game_over = true;
				google_callback_resolve()
			}
			if (resp.valid_move) {
				roll = resp.roll
				valid_move = true
			} else {
				valid_move = false
			}
		google_callback_resolve()
		}
	}

	function unbindTile (tile) {
		$(tile).unbind();
	}

	function unbindTiles () {
		_.each($tiles, function (tile) {
			$(tile).unbind();
		})
	}
	return {
		init: init
	}
})()

module.exports.play = play
