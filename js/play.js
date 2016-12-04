var game_selection = require('./gameSelection.js')
var animation = require('./animation.js')
var _ = require('underscore')
var Promise = require('promise')
var alertify = require('alertifyjs')

var play  = (function (){
	// initialize variables
	var username
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

		resetVars();
		// localize passed in variables
		username = passed_in_username
		user_exists = passed_in_user_exists
		urlsafe_key = passed_in_urlsafe_key
		dice_operation = passed_in_dice_operation
		number_of_tiles = passed_in_number_of_tiles

		cacheDOM()
		gameStatePromise()
		.then(ajaxGameFormPromise)
		.then(function () {
			cacheGameFormDOM()
			bindAllTiles();
			flipAlreadyFlippedTiles();
			firstRoll();
			bindRollButton();
			animation.animation.renderAddComponent($tile_container);
		})
	}

	function cacheDOM () {
		$gameplay_shell = $(".gameplay_shell")
	}

	function cacheGameFormDOM () {
		$tile_container = $gameplay_shell.find("#tile_container")
		$tiles = $tile_container.find(".tile")
		$dice_holder = $tile_container.find(".dice_holder")
		$dice_holder_2 = $tile_container.find(".dice_holder_2")
		$button = $tile_container.find("#roll_button")
		$game_over_message = $tile_container.find("#game_over_text")
		$perfect_game = $tile_container.find("#perfect_game")
	}

	// Either plays the first turn or gets the game state, flipping the already flipped tiles
	function gameStatePromise () {
		return new Promise(function (resolve, reject) {
			google_callback_resolve = resolve
			var turn_object = {urlsafe_key: urlsafe_key}
			gapi.client.shut_the_box.turn(turn_object).execute(gameStatePromiseCallback)
		})
	}
	function gameStatePromiseCallback (resp) {
		if (!resp.code) {
			active_tiles = resp.active_tiles
			roll = resp.roll
		}
		google_callback_resolve()
	}

	function ajaxGameFormPromise () {
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

	function flipAlreadyFlippedTiles () {
		_.each($tiles, function (tile) {
			var tile_number = getTileNumber(tile)
			if (!(_.contains(active_tiles, tile_number))) {
				$(tile).click();
				unbindTile(tile)
			}
		})
	}

	function firstRoll () {
		setTimeout(function () {
			$($dice_holder).dice().css("display", "none")
		}, 1000)
		setTimeout(function () {
			$($dice_holder).css("display","")
			$($dice_holder).dice("roll", roll[0])
		}, 1500)
		if (roll.length == 2) {
			setTimeout(function () {
				$($dice_holder_2).dice().css("display", "none")
			}, 1000)
			setTimeout(function () {
				$($dice_holder_2).css("display","")
				$($dice_holder_2).dice("roll", roll[1])
			}, 1500)
		} else {
			removeSecondDice()
		}
	}

	function evaluateTurn () {
		submitTurnPromise()
			.then(renderTurn)
	}

	function submitTurnPromise () {
		return new Promise( function(resolve, reject) {
			var flipped_tiles = new Array();
			_.each($tiles, function (tile) {
				if ($(tile).hasClass("temp_flipped")) {
					flipped_tiles.push(getTileNumber(tile))
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
				gapi.client.shut_the_box.turn(turn_object).execute(submitTurnPromiseCallback)
			}
		})
	}
	function submitTurnPromiseCallback (resp) {
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

	function renderTurn () {
		if (game_over == true) {
			rollDice();
			unbindRollButton();
			unbindTiles();
			renderGameOver();
		} else {
			if (valid_move) {
				valid_move = false;
				flipTiles();
				rollDice();
			} else {
				resetTiles();
				alertify.error('Improper move')
			}
		}
	}

	function rollDice () {
		if (!roll) {
			return
		}
		$dice_holder.dice('roll', roll[0])
		if (roll.length == 2) {
			$dice_holder_2.dice('roll', roll[1])
		} else {
			if (second_dice_exists) {
				removeSecondDice();
			}
			}
	}

	// the next three functions are tile manipulation
	function flipTiles () {
		_.each($tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				unbindTile(tile)
			}
		})
	}
	function resetTiles () {
		_.each($tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				$(tile).click();
			}
		})
	}

	function flipAction (event) {
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

	// These two functions operate after the game is over
	function renderGameOver () {
		//this is the Game over or perfect game message
		if (!roll) {
			$perfect_game.css("display","").addClass('animated fadeIn')
		} else {
			$game_over_message.css("display","").addClass('animated fadeIn')
		}
		// subbing out the roll button with a play again button
		var new_game_button = "<button class='ui button center aligned' id='play_again_button'>Play Again?</button>"
		$($button).replaceWith(new_game_button)
		$button = $tile_container.find("#play_again_button")
		bindPlayAgainButton();
	}

	function startNewGame () {
		unbindPlayAgainButton();
		animation.animation.renderRemoveComponent($tile_container)
		game_selection.game_selection.init(username, user_exists)
	}


	// this is just a simple utility to remove the second dice when tiles 7 and
	// up have all been flipped
	function removeSecondDice () {
		$($dice_holder_2).remove();
		second_dice_exists = false;
	}
	// Utility that gets the tile number from a tile passed in
	function getTileNumber (tile) {
		return String($(tile).find(".tile_number").data("number"))
	}
	//binding and unbindings
	function bindAllTiles () {
		_.each($tiles, function (tile) {
			$(tile).on("click", {tile: tile}, flipAction)
		})
	}
	function unbindTile (tile) {
		$(tile).addClass("flipped").removeClass("temp_flipped")
		$(tile).unbind();
	}
	function unbindTiles () {
		_.each($tiles, function (tile) {
			$(tile).unbind();
		})
	}

	function bindRollButton () {
		$button.on("click", evaluateTurn)
	}
	function unbindRollButton () {
		$button.unbind();
	}

	function bindPlayAgainButton () {
		$button.on("click", startNewGame)
	}
	function unbindPlayAgainButton () {
		$button.unbind()
	}

	return {
		init: init
	}
})()

module.exports.play = play
