var play = require('./play.js')
var animation = require('./animation.js')
var game_selection = (function () {
	function init (client, username, user_exists, cachePageDOM) {
		this.client = client
		this.cachePageDOM = cachePageDOM
		this.username = username
		this.user_exists = user_exists
		this.initVariables();
		this.cacheDOM();
		this.renderGameSelection()
	}

	function initVariables () {
		this.current_urlsafe_key = new String();
		this.open_games = null;
	}

	function newGameFormVariables () {
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
	}

	function continueGameFormVariables () {
		this.$radio_buttons_collection = this.$game_selection_form.find(".game_radio_button")
		this.$continue_game_button = this.$game_selection_form.find("#continue_game_button")
		this.continue_game_present = true
	}

	function activateToggleButtons () {
		this.bindButtonPair(this.$addition_button, this.$multiplication_button)
		this.bindButtonPair(this.$nine_button, this.$twelve_button)
	}

	function cacheDOM () {
		this.$game_selection_shell = this.cachePageDOM.$game_selection_shell
	}

	function renderGameSelection () {
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
	}

	function renderNewGameForm () {
		this.appendNewGameFormPromise().then(function () {
			this.newGameFormVariables()
			animation.animation.renderAddComponent(this.$game_selection_form)
			this.activateToggleButtons();
			this.bindNewGameButton();
		}.bind(this))
	}

	function renderContinueGameForm () {
		this.appendContinueGameFormPromise()
			.then( function () {
				this.newGameFormVariables()
				this.continueGameFormVariables()
				animation.animation.renderAddComponent(this.$game_selection_form)
				this.activateToggleButtons()
				this.bindRadioButtons()
				this.bindNewGameButton()
				this.bindContinueGameButton()
			}.bind(this))
	}

	function renderNewGame () {
		this.dice_operation = this.$dice_operation.find(".active").data().value
		this.number_of_tiles = this.$number_of_tiles.find(".active").data().value
		this.createGamePromise().then( function () {
			this.unbindToggleButtons();
			this.unbindNewGameButton();
			if (this.continue_game_present) {
				this.unbindContinueGameButton();
				this.unbindToggleButtons();
			}
			animation.animation.renderRemoveComponent(this.$game_selection_form)
			play.play.init(this.client, this.username, this.user_exists,
				this.current_urlsafe_key, this.dice_operation, this.number_of_tiles,
				this.cachePageDOM)
		}.bind(this))
	}

	function appendNewGameFormPromise () {
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
	}

	function createGamePromise () {
		return new Promise(function (resolve, reject) {
			var new_game_object = {
				dice_operation:  this.dice_operation,
				number_of_tiles: this.number_of_tiles,
				username:        this.username
			}
			this.callback_resolve = resolve
			this.client.shut_the_box.new_game(new_game_object).execute(this.createNewGame.bind(this))
		}.bind(this));
	}

	function createNewGame (resp) {
		if (!resp.code) {
			this.current_urlsafe_key = resp.urlsafe_key
		}
		this.callback_resolve();
	}

	function appendContinueGameFormPromise () {
		return new Promise( function (resolve, reject) {
			var game_selection_object = {games: this.open_games}
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
	}

	function findGamesPromise () {
		return new Promise(function (resolve, reject) {
			var find_games_object = {
				username:          this.username,
				games_in_progress: true
			};
			this.callback_resolve = resolve;
			this.client.shut_the_box.find_games(find_games_object).execute(this.addGames.bind(this));
		}.bind(this))
	}

	function addGames (resp) {
		if (!resp.code) {
			if (resp.games) {
				this.open_games = new Array()
				_.each(resp.games, function (game) {
					this.open_games.push(game)
				}, this);
			}
		};
		this.callback_resolve()
	}

	function whichFormRender () {
		if (this.open_games) {
			this.renderContinueGame()
		} else {
			this.renderNewGame()
		}
	}

	function bindNewGameButton () {
		this.$new_game_button.on("click", this.renderNewGame.bind(this))
	}

	function bindContinueGameButton () {
		this.$continue_game_button.on("click", this.renderContinueGame.bind(this))
	}

	function unbindNewGameButton () {
		this.$new_game_button.unbind();
	}

	function unbindToggleButtons () {
		this.$addition_button.unbind();
		this.$multiplication_button.unbind();
		this.$nine_button.unbind();
		this.$twelve_button.unbind();
	}

	function unbindContinueGameButton () {
		this.$continue_game_button.unbind();
	}

	function unbindRadioButtons () {
		_.each(this.$radio_buttons_collection, function (radio_button) {
			$(radio_button).unbind();
		});
	}

	function renderContinueGame ()  {
		this.setSelectedGameDetails();
		animation.animationrenderRemoveComponent(this.$game_selection_form);
		this.unbindNewGameButton();
		this.unbindToggleButtons();
		this.unbindContinueGameButton();
		this.unbindRadioButtons();
		play.play.init(this.client, this.current_urlsafe_key, this.dice_operation, this.number_of_tiles)
	}

	function setSelectedGameDetails () {
		var checked_radio = _.find(this.$radio_buttons_collection, function (radio_button) {
			if ($(radio_button).attr("checked")) {
				return true
			};
		});
		this.current_urlsafe_key = $(checked_radio).data("urlsafe_key")
		this.dice_operation = $(checked_radio).data("dice_operation")
		this.number_of_tiles = $(checked_radio).data("number_of_tiles")
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
		_.each($(this.$radio_buttons_collection), function (radio_button) {
			var id = $(radio_button).attr("id")
			$(radio_button).on("click", {radio_button: radio_button}, this.toggleRadio.bind(this))
		}, this)
	}

	function toggleRadio (event) {
		_.each($(this.$radio_buttons_collection), function (radio_button) {
			$(radio_button).removeAttr("checked")
		});
		$(event.data.radio_button).attr("checked", "checked")
	}
	return {
		init: init
	};
})()

module.exports.game_selection = game_selection
