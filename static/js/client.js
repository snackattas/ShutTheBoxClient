
function init() {
	gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
	username.init(gapi.client);
};

var animation  = {
	nextComponentAnimation: function (from, to) {
		$(from).addClass("animated fadeOut")
		setTimeout(this.removeComponent, 1500, from)
		setTimeout(this.addAnimation, 1600, to)
		setTimeout(this.removeAnimation, 3000, to)
	},
	introAnimation: function (component) {
		$(component).css("display","")
		$(component).addClass("animated fadeIn")
		setTimeout(this.removeAnimation, 1000, component)
	},
	removeAnimation: function (component) {
		$(component).removeClass("animated");
		$(component).removeClass("fadeIn");
	},
	removeComponent: function (component) {
		$(component).remove();
	},
	addAnimation: function (component) {
		$(component).css("display", "")
		$(component).addClass("animated fadeIn")
	}
}

var username = {
	init: function(client) {
		this.client = client;
		this.initVariables();
		this.cacheDom();
		animation.introAnimation(this.$username_form);
		this.renderUsernameForm();
	},
	initVariables: function () {
		this.username = new String();
		this.open_games = new Array();
	},
	cacheDom: function () {
		this.$body = $("body");
		this.$username_form = this.$body.find("#username_form");
		this.$username_field = this.$body.find("#username_field");
		this.$username_button = this.$body.find("#username_button");
		this.$game_selection = this.$body.find("#game_selection")
	},
	renderUsernameForm: function () {
		this.bindUsernameForm();
	},
	bindUsernameForm: function () {
		this.$username_button.on("click", this.usernameButton.bind(this));
	},
	usernameButton: function () {
		var username = this.$username_field.val();
		if (!username) {
			return
		};
		if (username.length > 80) {
			return
		};
		this.username = username;
		var username_object = {username: username};
		this.client.shut_the_box.create_user(username_object).execute(this.checkIfUserExists.bind(this));
		this.$username_button.unbind();
	},
	checkIfUserExists: function (resp) {
		if (resp.code === 409) {
			this.checkIfOpenGames()
		} else {
			this.retrieveNewGame()
		}
	},
	retrieveNewGame: function () {
		$.ajax({
			url: "/new_game",
			success: function (json) {
				var html = json.html
				console.log(html)
				$(this.$game_selection).append(html)
				animation.nextComponentAnimation(this.$username_form, this.$game_selection)
			}.bind(this)
		})
	},
	retrieveContinueGame: function () {
		var game_selection_object = {games: this.open_games}
		console.log(game_selection_object)
		$.ajax({
			url: "/continue_game",
			datatype: "json",
			data: game_selection_object,
			success: function (json) {
				$(this.$game_selection).html(json.html)
				animation.nextComponentAnimation(this.$username_form, this.$game_selection)
			}.bind(this)
		});
	},
	checkIfOpenGames: function () {
		var find_games_object = {
			username:          this.username,
			games_in_progress: true
		};
		this.client.shut_the_box.find_games(find_games_object).execute(this.addGames.bind(this));
	},
	addGames: function (resp) {
		if (!resp.code) {
			if (resp.games) {
				_.each(resp.games, function (game) {
					this.open_games.push(game)
				}, this);
				this.retrieveContinueGame();
			} else {
				this.retrieveNewGame()
			}
		};
	}
}




var game_selection = {
	initVariables: function () {
		this.current_urlsafe_key = new String();
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
		var new_game_object = {
			dice_operation:  dice_operation,
			number_of_tiles: number_of_tiles,
			username:        this.username
		}
		this.client.shut_the_box.new_game(new_game_object).execute(this.newGameSet.bind(this))
	},
	newGameSet: function (resp) {
		if (resp) {
			this.current_urlsafe_key = resp.urlsafe_key
		}
	},

}


// attr("checked", "checked")
//removeAttr("checked")
//to check if attr is there: .attr("checked")
var play = {
	initVariables: function () {
		this.active_tiles = new Array();
		this.flipped_tiles = new Array();
		this.temp_active_tiles = new Array();
		this.temp_flipped_tiles = new Array();
	},

}
