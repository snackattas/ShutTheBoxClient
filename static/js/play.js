var game_selection = require('./gameSelection.js')
var animation = require('./animation.js')

var play  = {
	init: function (client, username, user_exists, urlsafe_key, dice_operation, number_of_tiles, cachePageDOM) {
		// initialize passed in variables
		this.client = client
		this.username = username
		this.user_exists = user_exists
		this.urlsafe_key = urlsafe_key
		this.dice_operation = dice_operation
		this.number_of_tiles = number_of_tiles
		this.cachePageDOM = cachePageDOM
		this.initVariables()
		this.gameStatePromise()
		.then( this.appendTilesPromise.bind(this))
		.then( function () {
			this.initTiles()
			animation.animation.renderAddComponent(this.$tile_container);
			this.bindAllTiles();
			this.setGameState();
			this.bindRollButton();
		}.bind(this))
	},
	initVariables: function () {
		this.$gameplay_shell = this.cachePageDOM.$gameplay_shell
		this.active_tiles = new Array();
		this.flipped_tiles = new Array();
		this.temp_active_tiles = new Array();
		this.temp_flipped_tiles = new Array();
		this.roll = new Array();
		this.second_dice_exists = true;
		this.valid_move = false;
		this.game_over = false;
	},
	initTiles: function () {
		this.$tile_container = this.$gameplay_shell.find("#tile_container")
		this.$tiles = this.$tile_container.find(".tile")
		this.$dice_holder = this.$tile_container.find(".dice_holder")
		this.$dice_holder_2 = this.$tile_container.find(".dice_holder_2")
		this.$button = this.$tile_container.find("#roll_button")
		this.$game_over_message = this.$tile_container.find("#game_over_text")
	},
	gameStatePromise: function () {
		return new Promise(function (resolve, reject) {
			this.callback_resolve = resolve
			// call turn with only the urlsafe-key.  If it's a new game, it creates
			// the first roll.  If it's a continued game, it will return the last roll
			// and the active tiles in play, which we use to establish the continued game
			// state
			var turn_object = {urlsafe_key: this.urlsafe_key}
			this.client.shut_the_box.turn(turn_object).execute(this.setGameVariables.bind(this))
		}.bind(this))
	},
	setGameVariables: function (resp) {
		if (!resp.code) {
			this.active_tiles = resp.active_tiles
			this.roll = resp.roll
		}
		this.callback_resolve()
	},
	appendTilesPromise: function () {
		var data_object = {number_of_tiles: this.number_of_tiles}
		return new Promise( function (resolve, reject) {
			this.ajax_callback = resolve
			$.ajax({
				url: "/tiles",
				datatype: 'json',
				data: data_object,
				success: function (json) {
					this.$gameplay_shell.append(json.html)
					this.ajax_callback()
				}.bind(this)
			});
		}.bind(this));
	},
	bindAllTiles: function() {
		_.each(this.$tiles, function (tile) {
			$(tile).on("click", {tile: tile}, this.tileAction.bind(this))
		}, this)
	},
	setGameState: function() {
		_.each(this.$tiles, function (tile) {
			var tile_number = this.extractTileNumber(tile)
			if (!(_.contains(this.active_tiles, tile_number))) {
				$(tile).click();
				this.flipTile(tile)
			}
		}, this)
		this.startDice(this.$dice_holder, this.roll[0])
		if (this.roll.length == 2) {
			this.startDice(this.$dice_holder_2, this.roll[1])
		} else {
			this.removeSecondDice()
		}
	},
	flipTile: function (tile) {
		$(tile).addClass("flipped").removeClass("temp_flipped")
		this.unbindTile(tile)
	},
	startDice: function (dice, roll) {
		setTimeout(this.createFirstDice.bind(this), 1000, dice)
		setTimeout(this.rollFirstDice.bind(this), 1500, dice, roll)
	},
	createFirstDice: function (dice) {
		$(dice).dice().css("display", "none")
	},
	rollFirstDice: function(dice,roll) {
		$(dice).css("display", "")
		$(dice).dice('roll', roll);
	},
	removeSecondDice: function () {
		$(this.$dice_holder_2).remove();
		this.second_dice_exists = false;
	},
	tileAction: function (event) {
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
	},
	bindRollButton: function () {
		this.$button.on("click", this.rollAction.bind(this))
	},
	unbindRollButton: function () {
		this.$button.unbind();
	},
	rollAction: function () {
		this.checkTurn()
			.then( this.renderTurn.bind(this))
	},
	extractTileNumber: function (tile) {
		return String($(tile).find(".tile_number").data("number"))
	},
	renderTurn: function () {
		if (this.game_over == true) {
			this.rollDice();
			console.log('game over')
			this.unbindRollButton();
			this.unbindTiles();
			this.newGameOption();
		} else {
			if (this.valid_move) {
				console.log('valid m ove')
				this.valid_move = false;
				this.convertTempFlippedTiles();
				this.rollDice();
			} else {
				console.log('not valid move')
				this.resetTempFlippedTiles();
				alertify.error('Improper move')
			}
		}
	},
	newGameOption: function () {
		console.log('in new game')
		this.$game_over_message.css("display","").addClass('animated fadeIn')
		var new_game_button = "<button class='ui button center aligned' id='play_again_button'>Play Again?</button>"
		$(this.$button).replaceWith(new_game_button)
		this.$button = this.$tile_container.find("#play_again_button")
		this.bindNewGameButton();
	},
	bindNewGameButton: function () {
		this.$button.on("click", this.startNewGame.bind(this))
	},
	unbindNewGameButton: function () {
		this.$button.unbind()
	},
	startNewGame: function () {
		console.log('in start new game')
		this.unbindNewGameButton();
		animation.animation.renderRemoveComponent(this.$tile_container)
		game_selection.game_selection.init(this.client, this.username, this.user_exists, this.cachePageDOM)
	},
	resetTempFlippedTiles: function () {
		_.each(this.$tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				$(tile).click();
			}
		}, this)
	},
	rollDice: function () {
		if (this.roll.length == 2) {
			this.$dice_holder.dice('roll', this.roll[0])
			this.$dice_holder_2.dice('roll', this.roll[1])
		} else {
			if (this.second_dice_exists) {
				this.removeSecondDice();
			}
			this.$dice_holder.dice('roll', this.roll[0])
			}
	},
	convertTempFlippedTiles: function () {
		_.each(this.$tiles, function (tile) {
			if ($(tile).hasClass("temp_flipped")) {
				this.flipTile(tile)
			}
		}, this)
	},
	checkTurn: function () {
		return new Promise( function(resolve, reject) {
			var flipped_tiles = new Array();
			_.each(this.$tiles, function (tile) {
				if ($(tile).hasClass("temp_flipped")) {
					flipped_tiles.push(this.extractTileNumber(tile))
				}
			}, this)
			if (flipped_tiles.length == 0) {
				console.log("no tiles")
				this.valid_move = false;
				resolve()
			} else {
				var turn_object = {
					urlsafe_key: this.urlsafe_key,
					flip_tiles: flipped_tiles
				}
				this.validate_callback = resolve
				console.log('about to call turn')
				this.client.shut_the_box.turn(turn_object).execute(this.setTurnVariables.bind(this))
			}
		}.bind(this))
	},
	setTurnVariables: function (resp) {
		if (resp) {
			console.log('in resp')
			if (resp.game_over) {
				this.roll = resp.roll
				this.game_over = true;
				this.validate_callback()
			}
			if (resp.valid_move) {
				this.roll = resp.roll
				this.valid_move = true
			} else {
				this.valid_move = false
			}
		this.validate_callback()
		}
	},
	unbindTile: function(tile) {
		$(tile).unbind();
	},
	unbindTiles: function () {
		_.each(this.$tiles, function (tile) {
			$(tile).unbind();
		}, this)
	}
}

module.exports.play = play
