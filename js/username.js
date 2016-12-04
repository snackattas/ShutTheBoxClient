var game_selection = require("./gameSelection.js")
var animation = require("./animation.js")
var _ = require('underscore')
var Promise = require('promise')

function initWebsite (api_initialized) {
	if (typeof window['gapi'] !== 'undefined') {
			if ((gapi.client) && (gapi.client.shut_the_box)) {
				username.init()
				return
			}
			if ((gapi.client) && (!(gapi.client.shut_the_box)) && (!(api_initialized))) {
				gapi.client.load("shut_the_box", "v1", null, "https://zattas-game.appspot.com/_ah/api")
				var api_initialized = true
				window.setTimeout(initWebsite, 100, api_initialized)
			} else {
				window.setTimeout(initWebsite, 100, api_initialized)
			}
		} else {
			window.setTimeout(initWebsite, 100)
		}
}

var username = (function(){
	// initialize variables
	var username = new String();
	var user_exists = false;
	var callback_resolve = new Function();
	var $username_form = new Object();
	var $username_field = new Object();
	var $username_button = new Object();
	var $game_selection_shell = new Object();

	// entrypoint
	function init () {
		cacheDOM();
		animation.animation.introAnimation($username_form);
		bindUsernameButton();
	}

	function cacheDOM () {
		var $body = $("body");
		$username_form = $body.find("#username_form")
		$username_field = $username_form.find("#username_field");
		$username_button = $username_form.find("#username_button");
		$game_selection_shell = $body.find(".game_selection_shell")
	}

	// main action once user clicks sumbit button
	function submitUser () {
		var username_value = $username_field.val();
		if (!username_value) {
			return
		};
		if (username.length > 80) {
			return
		};
		username = username_value;
		createUserPromise()
			.then(unbindUsernameButtonPromise)
			.then(toGameSelectionPromise)
	}

	// creates user and checks if the user exists already
	function createUserPromise () {
		return new Promise(function (resolve, reject) {
			var username_object = {username: username};
			callback_resolve = resolve;
			gapi.client.shut_the_box.create_user(username_object).execute(createUserPromiseCallback);
		})
	}

	// checks if user already exists
	function createUserPromiseCallback (resp) {
		if (resp.code === 409) {
			user_exists = true;
		}
		callback_resolve();
	}

	// last promise to render the removal of the component and call the next component
	function toGameSelectionPromise () {
		return new Promise(function (resolve, reject) {
			animation.animation.renderRemoveComponent($username_form)
			game_selection.game_selection.init(username, user_exists)
			resolve()
		});
	}

	// binds and unbinds
	function bindUsernameButton () {
		$username_button.on("click", submitUser);
	}

	function unbindUsernameButtonPromise () {
		return new Promise(function (resolve, reject) {
			unbindUsernameButton();
			resolve();
		});
	}

	function unbindUsernameButton () {
		$username_button.unbind();
	}

	return {
		init: init
	}
})()

module.exports = {
	initWebsite: initWebsite
}
