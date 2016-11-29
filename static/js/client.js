
function init() {
	gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
	cacheDOM.cache();
	username.init(gapi.client);
};

var animation  = {
	init: function() {
		this.in_animation = false;
	},
	introAnimation: function (component) {
		$(component).css("display","")
		$(component).addClass("animated fadeIn")
		setTimeout(this.removeAnimation, 1000, component)
	},
	removeAnimationClass: function (component) {
		$(component).removeClass("animated");
		$(component).removeClass("fadeIn");
	},
	removeComponent: function (component) {
		$(component).remove()
		console.log('component gone')
		this.in_animation = false;
	},
	renderRemoveComponent: function (component) {
		this.removeAnimationClass(component)
		$(component).addClass("animated fadeOut")
		this.in_animation = true;
		setTimeout(this.removeComponent.bind(this), 800, component)
	},
	renderAddComponent: function (component) {
		if (this.in_animation) {
			console.log('in renderaddcomponent')
			setTimeout(this.renderAddComponent.bind(this), 10, component)
		} else {
			console.log('in else block')
			this.addComponent(component)
		}
	},
	addComponent: function (component) {
		$(component).css("display","")
		$(component).addClass("animated fadeIn")
	}
}

// animation.init();

var cacheDOM = {
	cache: function () {
		this.$body = $("body");
		this.$username_form = this.$body.find("#username_form");
		this.$game_selection_shell = this.$body.find(".game_selection_shell")
		this.$gameplay_shell = this.$body.find(".gameplay_shell")
	}
};


var username = {
	init: function(client) {
		this.client = client;
		this.initVariables();
		this.cacheDOM();
		animation.introAnimation(this.$username_form);
		this.bindUsernameButton();
	},
	initVariables: function () {
		this.username = new String();
		this.user_exists = false;
		this.current_urlsafe_key = new String();
		this.active_tiles = new Array();
		this.flipped_tiles = new Array();
		this.temp_active_tiles = new Array();
		this.temp_flipped_tiles = new Array();
	},
	cacheDOM: function () {
		this.$username_form = cacheDOM.$username_form
		this.$username_field = this.$username_form.find("#username_field");
		this.$username_button = this.$username_form.find("#username_button");
		this.$game_selection_shell = cacheDOM.$game_selection_shell
	},
	bindUsernameButton: function () {
		this.$username_button.on("click", this.assignUsername.bind(this));
	},
	unbindUsernameButton: function () {
		this.$username_button.unbind();
	},
	assignUsername: function () {
		var username = this.$username_field.val();
		if (!username) {
			return
		};
		if (username.length > 80) {
			return
		};
		this.username = username;
		this.createUserPromise()
			.then(this.unbindUsernameButtonPromise.bind(this))
			.then(this.toGameSelectionPromise.bind(this))
	},
	createUserPromise: function () {
		return new Promise(function (resolve, reject) {
			console.log('in createuserprom')
			var username_object = {username: this.username};
			this.callback_resolve = resolve;
			this.client.shut_the_box.create_user(username_object).execute(this.doesUserExist.bind(this));
		}.bind(this))
	},
	doesUserExist: function (resp) {
		console.log("inuser exists")
		if (resp.code === 409) {
			this.user_exists = true;
		}
		this.callback_resolve();
	},
	unbindUsernameButtonPromise: function () {
		return new Promise(function (resolve, reject) {
			console.log("in button")
			this.unbindUsernameButton();
			resolve();
		}.bind(this));
	},
	toGameSelectionPromise: function () {
		return new Promise(function (resolve, reject) {
			// game_selection.init()
			console.log('calling game selection')
			animation.renderRemoveComponent(this.$username_form)
			game_selection.init(this.client)
			resolve()
		}.bind(this));
	}
}

var game_selection = {
	init: function (client) {
		this.client = client
		this.initVariables();
		this.cacheDOM();
		this.renderGameSelection()
	},
	initVariables: function () {
		this.current_urlsafe_key = new String();
		this.open_games = null;
		this.username = username.username;
		this.user_exists = username.user_exists;
	},
	newGameFormVariables: function () {
		this.$game_selection_form = this.$game_selection_shell.find("#game_selection_form")
		this.$dice_operation = this.$game_selection_form.find("#dice_operation")
		this.$number_of_tiles = this.$game_selection_form.find("#number_of_tiles")
		this.$addition_button = this.$dice_operation.find("#addition_button")
		this.$multiplication_button = this.$dice_operation.find("#multiplication_button")
		this.$nine_button = this.$number_of_tiles.find("#nine_button")
		this.$twelve_button = this.$number_of_tiles.find("#twelve_button")
		this.$new_game_button = this.$game_selection_form.find("#new_game_button")
		this.dice_operation = new String();
		this.number_of_tiles = new String();
		this.continue_game_present = false
	},
	continueGameFormVariables: function () {
		this.$radio_buttons_collection = this.$game_selection_form.find(".game_radio_button")
		this.$continue_game_button = this.$game_selection_form.find("#continue_game_button")
		this.continue_game_present = true
	},
	activateToggleButtons: function () {
		this.bindButtonPair(this.$addition_button, this.$multiplication_button)
		this.bindButtonPair(this.$nine_button, this.$twelve_button)
	},
	cacheDOM: function () {
		this.$game_selection_shell = username.$game_selection_shell
	},
	renderGameSelection: function () {
		if (!this.user_exists) {
			this.renderNewGameForm();
		} else {
			this.findGamesPromise()
				.then( function () {
					if (this.open_games) {
						this.renderContinueGameForm();
					} else {
						this.renderNewGameForm();
					}
				}.bind(this))
		}
	},
	renderNewGameForm: function () {
		this.appendNewGameFormPromise().then(function () {
			this.newGameFormVariables()
			animation.renderAddComponent(this.$game_selection_form)
			this.activateToggleButtons();
			this.bindNewGameButton();
		}.bind(this))
	},
	renderContinueGameForm: function () {
		this.appendContinueGameFormPromise()
			.then( function () {
				this.newGameFormVariables()
				this.continueGameFormVariables()
				animation.renderAddComponent(this.$game_selection_form)
				this.activateToggleButtons()
				this.bindRadioButtons()
				this.bindNewGameButton()
				this.bindContinueGameButton()
			}.bind(this))
	},
	renderNewGame: function () {
		this.dice_operation = this.$dice_operation.find(".active").data().value
		this.number_of_tiles = this.$number_of_tiles.find(".active").data().value
		this.createGamePromise().then( function () {
			this.unbindToggleButtons();
			this.unbindNewGameButton();
			if (this.continue_game_present) {
				this.unbindContinueGameButton();
				this.unbindToggleButtons();
			}
			animation.renderRemoveComponent(this.$game_selection_form)
			play.init(this.client, this.current_urlsafe_key, this.dice_operation,
				this.number_of_tiles)
		}.bind(this))
	},
	appendNewGameFormPromise: function () {
		console.log("in append new game")
		return new Promise( function (resolve, reject) {
			this.ajax_callback = resolve
			$.ajax({
				url: "/new_game",
				success: function (json) {
					$(this.$game_selection_shell).append(json.html)
					this.ajax_callback()
				}.bind(this)
			});
		}.bind(this));
	},
	createGamePromise: function () {
		return new Promise(function (resolve, reject) {
			var new_game_object = {
				dice_operation:  this.dice_operation,
				number_of_tiles: this.number_of_tiles,
				username:        this.username
			}
			this.callback_resolve = resolve
			this.client.shut_the_box.new_game(new_game_object).execute(this.createNewGame.bind(this))
		}.bind(this));
	},
	createNewGame: function (resp) {
		if (!resp.code) {
			this.current_urlsafe_key = resp.urlsafe_key
		}
		this.callback_resolve();
	},
	appendContinueGameFormPromise: function () {
		return new Promise( function (resolve, reject) {
			var game_selection_object = {games: this.open_games}
			console.log(game_selection_object)
			this.ajax_callback = resolve
			$.ajax({
				url: "/continue_game",
				datatype: "json",
				data: game_selection_object,
				success: function (json) {
					$(this.$game_selection_shell).append(json.html)
					this.ajax_callback()
				}.bind(this)
			});
		}.bind(this))
	},
	findGamesPromise: function () {
		return new Promise(function (resolve, reject) {
			console.log('in find games promis')
			var find_games_object = {
				username:          this.username,
				games_in_progress: true
			};
			this.callback_resolve = resolve;
			this.client.shut_the_box.find_games(find_games_object).execute(this.addGames.bind(this));
		}.bind(this))
	},
	addGames: function (resp) {
		console.log('in add games')
		if (!resp.code) {
			if (resp.games) {
				console.log('games')
				console.log(resp.games)
				this.open_games = new Array()
				_.each(resp.games, function (game) {
					this.open_games.push(game)
				}, this);
			}
		};
		this.callback_resolve()
	},
	whichFormRender: function() {
		console.log('in which form')
		if (this.open_games) {
			this.renderContinueGame()
		} else {
			this.renderNewGame()
		}
	},
	bindNewGameButton: function () {
		this.$new_game_button.on("click", this.renderNewGame.bind(this))
	},
	bindContinueGameButton: function () {
		this.$continue_game_button.on("click", this.renderContinueGame.bind(this))
	},
	unbindNewGameButton: function () {
		this.$new_game_button.unbind();
	},
	unbindToggleButtons: function () {
		this.$addition_button.unbind();
		this.$multiplication_button.unbind();
		this.$nine_button.unbind();
		this.$twelve_button.unbind();
	},
	unbindContinueGameButton: function () {
		this.$continue_game_button.unbind();
	},
	unbindRadioButtons: function () {
		_.each(this.$radio_buttons_collection, function (radio_button) {
			$(radio_button).unbind();
		});
	},
	renderContinueGame: function ()  {
		this.setSelectedGameDetails();
		animation.renderRemoveComponent(this.$game_selection_form);
		this.unbindNewGameButton();
		this.unbindToggleButtons();
		this.unbindContinueGameButton();
		this.unbindRadioButtons();
		play.init(this.client, this.current_urlsafe_key, this.dice_operation, this.number_of_tiles)
	},
	setSelectedGameDetails: function () {
		var checked_radio = _.find(this.$radio_buttons_collection, function (radio_button) {
			if ($(radio_button).attr("checked")) {
				return true
			};
		});
		this.current_urlsafe_key = $(checked_radio).data("urlsafe_key")
		this.dice_operation = $(checked_radio).data("dice_operation")
		this.number_of_tiles = $(checked_radio).data("number_of_tiles")
	},
	bindButtonPair: function (button1, button2) {
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
	},
	bindRadioButtons: function () {
		_.each($(this.$radio_buttons_collection), function (radio_button) {
			var id = $(radio_button).attr("id")
			$(radio_button).on("click", {radio_button: radio_button}, this.toggleRadio.bind(this))
		}, this)
	},
	toggleRadio: function (event) {
		_.each($(this.$radio_buttons_collection), function (radio_button) {
			$(radio_button).removeAttr("checked")
		});
		$(event.data.radio_button).attr("checked", "checked")
	}
}

var play  = {
	init: function (client, urlsafe_key, dice_operation, number_of_tiles) {
		this.client = client
		this.urlsafe_key = urlsafe_key
		this.dice_operation = dice_operation
		this.number_of_tiles = number_of_tiles
		console.log('in play')
		console.log(urlsafe_key)
		console.log(this.dice_operation)
		console.log(this.number_of_tiles)
		this.initVariables()
		this.initGamePromise()
		.then( this.appendTilesPromise.bind(this))
		.then( function () {
			this.initTiles()
			console.log(this.$domino_container)
			animation.renderAddComponent(this.$domino_container)
			$(this.$dice_holder).dice();
			$(this.$dice_holder_2).dice();
			this.bindAllTiles();
			this.continuedGameState()
		}.bind(this))
	},
	initVariables: function () {
		this.active_tiles = new Array();
		this.flipped_tiles = new Array();
		this.temp_active_tiles = new Array();
		this.temp_flipped_tiles = new Array();
		this.roll = new Array();
	},
	initTiles: function () {
		this.$domino_container = cacheDOM.$gameplay_shell.find("#domino_container")
		this.$tiles = this.$domino_container.find(".domino")
		this.$dice_holder = cacheDOM.$gameplay_shell.find(".dice_holder")
		this.$dice_holder_2 = cacheDOM.$gameplay_shell.find(".dice_holder_2")
		console.log(this.$dice_holder)
	},
	initGamePromise: function () {
		return new Promise(function (resolve, reject) {
			console.log('in first roll promise')
			this.callback_resolve = resolve
			var turn_object = {urlsafe_key: this.urlsafe_key}
			this.client.shut_the_box.turn(turn_object).execute(this.setGameState.bind(this))
		}.bind(this))
	},
	setGameState: function (resp) {
		console.log('in set game state')
		if (!resp.code) {
			this.active_tiles = resp.active_tiles
			this.roll = resp.roll
		}
		this.callback_resolve()
	},
	appendTilesPromise: function () {
		console.log("in append tiles")
		data_object = {number_of_tiles: this.number_of_tiles, active_tiles: this.active_tiles}
		console.log(data_object)
		return new Promise( function (resolve, reject) {
			console.log('in append tiles promise')
			this.ajax_callback = resolve
			$.ajax({
				url: "/tiles",
				datatype: 'json',
				data: data_object,
				success: function (json) {
					console.log('finished ajax')
					cacheDOM.$gameplay_shell.append(json.html)
					this.ajax_callback()
				}.bind(this)
			});
		}.bind(this));
	},
	bindAllTiles: function() {
		_.each(this.$tiles, function (tile) {
			$($tile).on("click", {tile: tile}, this.tileAction.bind(this))
		}, this)
	},
	continuedGameState: function() {
		_.each(this.$tiles, function (tile) {
			if ($(tile).hasClass("already_flipped")) {
				$(tile).click();
				this.unbindTile(tile)
			}
		}, this)
		if (play.roll.length == 2) {
			$(this.dice_holder).dice("roll", play.roll[0])
			$(this.dice_holder2).dice("roll", play.roll[1])
		} else {
			$(this.dice_holder).dice("roll", play.roll[0])
			$(this.dice_holder2).remove()
		}
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
	unbindTile: function(tile) {
		$(tile).unbind()
	}
}
