var client;
function init() {
	gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
	client = gapi.client;
	console.log('in init')
	main.init(client);
};

var main = {
	init: function(client) {
		this.client = client;
		this.initVariables();
		this.cacheDom();
		this.renderUsernameForm();
		alert('here')
	},
	cacheDom: function () {
		this.$body = $("body");
		this.$username_form = this.$body.find("#username_form");
		this.$username_field = this.$body.find("#username_field");
		this.$username_button = this.$body.find("#username_button");
		this.$game_selection = this.$body.find("#game_selection");
		this.$dice_operation = this.$body.find("#dice_operation");
		this.$number_of_tiles = this.$body.find("#number_of_tiles");
		this.$addition_button = this.$body.find("#addition_button");
		this.$multiplication_button = this.$body.find("#multiplication_button");
		this.$nine_button = this.$body.find("#nine_button");
		this.$twelve_button = this.$body.find("#twelve_button");
		this.$nine_domino_container = this.$body.find("#nine_domino_container");
		this.$twelve_domino_container = this.$body.find("#twelve_domino_container");
		this.$new_game_button = this.$body.find("#new_game_button");
	},
	initVariables: function () {
		this.active_tiles = new Array();
		this.flipped_tiles = new Array();
		this.temp_active_tiles = new Array();
		this.temp_flipped_tiles = new Array();
		this.open_games = new Array();
		this.current_urlsafe_key = new String();
		this.username = new String();
	},
	renderUsernameForm: function () {
		this.bindUsernameForm();
	},
	nextComponentAnimation: function (from, to) {
		$(from).addClass("animated fadeOut");
		$(to).addClass("animated fadeIn");
		setTimeout(function (from, to) {
			$(from).removeClass("animated")
			$(from).removeClass("fadeOut")
			$(from).css("display", "none")
			$(to).removeClass("animated")
			$(to).removeClass("fadeIn")
		}, 1500)
	},
	bindToggleButtons: function (button1, button2) {
		$(button1).on("click", function (e) {
			e.preventDefault()
			$(button1).addClass('active')
			$(button2).removeClass('active')
		});
		$(button2).on("click", function (e) {
			e.preventDefault()
			$(button2).addClass("active")
			$(button1).removeClass("active")
		});
	},
	renderNewGameForm: function () {
		this.bindToggleButtons(this.$addition_button, this.$multiplication_button);
		this.bindToggleButtons(this.$nine_button, this.$twelve_button);
		this.bindNewGameButton();
	},
	bindNewGameButton: function () {
		$(this.$new_game_button).on("click", this.newGameCreate.bind(this));
	},
	newGameCreate: function () {
		var dice_operation = $(this.$dice_operation).find('.active').data().value
		var number_of_tiles = $(this.$number_of_tiles).find('.active').data().value
		console.log("new game play")
		var new_game_array = {
			dice_operation:  dice_operation,
			number_of_tiles: number_of_tiles,
			username:        this.username
		}
		this.client.shut_the_box.new_game(new_game_array).execute(this.newGameSet.bind(this))
	},
	newGameSet: function (resp) {
		if (resp) {
			this.current_urlsafe_key = resp.urlsafe_key
		}
	},
	bindUsernameForm: function () {
		this.$username_button.on("click", this.addUser.bind(this));
	},
	addUser: function () {
		var username = this.$username_field.val();
		console.log('here')
		if (!username) {
			return
		};
		if (username.length > 80) {
			return
		};
		this.username = username;
		var username_array = {username: username};
		this.client.shut_the_box.create_user(username_array).execute( function (resp) {
			console.log("in create user")
			if (resp.code === 409) {
				main.retrieveOpenGames();
			}
		});
		this.$username_button.unbind();
		// renderGamesComponent();
		// nextComponentAnimation(this.$username_form, this.$game_selection)
	},
	retrieveOpenGames: function () {
		console.log("in oopen games")
		var find_games_array = {
			username:          this.username,
			games_in_progress: true
		};
		this.client.shut_the_box.find_games(find_games_array).execute( function (resp) {
			if (!resp.code) {
				if (resp.games) {
					_.each(resp.games, function (game) {
						main.open_games.push(game)
					});
				};
			};
		});
	},
	renderGamesComponent: function () {
		return
	}
};
