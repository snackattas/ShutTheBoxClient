/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var initWebsite = __webpack_require__(1);
	initWebsite.initWebsite()


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["initWebsite"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var game_selection = __webpack_require__(3)
	var animation = __webpack_require__(5)
	var _ = __webpack_require__(6)
	var Promise = __webpack_require__(7)

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var play = __webpack_require__(4)
	var animation = __webpack_require__(5)
	var _ = __webpack_require__(6)
	var Promise = __webpack_require__(7)

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
			if (user_exists) {
				findGamesPromise()
				.then( function () {
					if (open_games.length > 0) {
						renderContinueGameForm();
					} else {
						renderNewGameForm();
					}
					})
			} else {
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var game_selection = __webpack_require__(3)
	var animation = __webpack_require__(5)
	var _ = __webpack_require__(6)
	var Promise = __webpack_require__(7)
	var alertify = __webpack_require__(16)

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	var animation  = (function(){
	  var in_animation
	  var $loader = $(".loader")

		function introAnimation (component) {
			$(component).css("display","")
			$(component).addClass("animated fadeIn")
	    $($loader).removeClass("active")
			setTimeout(removeAnimationClass, 1000, component)
		}

		function removeAnimationClass (component) {
			$(component).removeClass("animated");
			$(component).removeClass("fadeIn");
		}

		function removeComponent (component) {
			$(component).remove()
		   in_animation = false;
			$($loader).addClass("active")
		}

		function renderRemoveComponent (component) {
			removeAnimationClass(component)
			$(component).addClass("animated fadeOut")
			in_animation = true;
			setTimeout(removeComponent, 800, component)
		}

		function renderAddComponent (component) {
			if (in_animation) {
				setTimeout(renderAddComponent, 10, component)
			} else {
				addComponent(component)
			}
		}

		function addComponent (component) {
			$($loader).removeClass("active")
			$(component).css("display","")
			$(component).addClass("animated fadeIn")
		}

	  return {
	    introAnimation: introAnimation,
	    renderRemoveComponent: renderRemoveComponent,
	    renderAddComponent: renderAddComponent
	  }
	})()

	module.exports.animation = animation


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(8)


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(9);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var asap = __webpack_require__(10);

	function noop() {}

	// States:
	//
	// 0 - pending
	// 1 - fulfilled with _value
	// 2 - rejected with _value
	// 3 - adopted the state of another promise, _value
	//
	// once the state is no longer pending (0) it is immutable

	// All `_` prefixed properties will be reduced to `_{random number}`
	// at build time to obfuscate them and discourage their use.
	// We don't use symbols or Object.defineProperty to fully hide them
	// because the performance isn't good enough.


	// to avoid using try/catch inside critical functions, we
	// extract them to here.
	var LAST_ERROR = null;
	var IS_ERROR = {};
	function getThen(obj) {
	  try {
	    return obj.then;
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}

	function tryCallOne(fn, a) {
	  try {
	    return fn(a);
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}
	function tryCallTwo(fn, a, b) {
	  try {
	    fn(a, b);
	  } catch (ex) {
	    LAST_ERROR = ex;
	    return IS_ERROR;
	  }
	}

	module.exports = Promise;

	function Promise(fn) {
	  if (typeof this !== 'object') {
	    throw new TypeError('Promises must be constructed via new');
	  }
	  if (typeof fn !== 'function') {
	    throw new TypeError('not a function');
	  }
	  this._37 = 0;
	  this._12 = null;
	  this._59 = [];
	  if (fn === noop) return;
	  doResolve(fn, this);
	}
	Promise._99 = noop;

	Promise.prototype.then = function(onFulfilled, onRejected) {
	  if (this.constructor !== Promise) {
	    return safeThen(this, onFulfilled, onRejected);
	  }
	  var res = new Promise(noop);
	  handle(this, new Handler(onFulfilled, onRejected, res));
	  return res;
	};

	function safeThen(self, onFulfilled, onRejected) {
	  return new self.constructor(function (resolve, reject) {
	    var res = new Promise(noop);
	    res.then(resolve, reject);
	    handle(self, new Handler(onFulfilled, onRejected, res));
	  });
	};
	function handle(self, deferred) {
	  while (self._37 === 3) {
	    self = self._12;
	  }
	  if (self._37 === 0) {
	    self._59.push(deferred);
	    return;
	  }
	  asap(function() {
	    var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;
	    if (cb === null) {
	      if (self._37 === 1) {
	        resolve(deferred.promise, self._12);
	      } else {
	        reject(deferred.promise, self._12);
	      }
	      return;
	    }
	    var ret = tryCallOne(cb, self._12);
	    if (ret === IS_ERROR) {
	      reject(deferred.promise, LAST_ERROR);
	    } else {
	      resolve(deferred.promise, ret);
	    }
	  });
	}
	function resolve(self, newValue) {
	  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	  if (newValue === self) {
	    return reject(
	      self,
	      new TypeError('A promise cannot be resolved with itself.')
	    );
	  }
	  if (
	    newValue &&
	    (typeof newValue === 'object' || typeof newValue === 'function')
	  ) {
	    var then = getThen(newValue);
	    if (then === IS_ERROR) {
	      return reject(self, LAST_ERROR);
	    }
	    if (
	      then === self.then &&
	      newValue instanceof Promise
	    ) {
	      self._37 = 3;
	      self._12 = newValue;
	      finale(self);
	      return;
	    } else if (typeof then === 'function') {
	      doResolve(then.bind(newValue), self);
	      return;
	    }
	  }
	  self._37 = 1;
	  self._12 = newValue;
	  finale(self);
	}

	function reject(self, newValue) {
	  self._37 = 2;
	  self._12 = newValue;
	  finale(self);
	}
	function finale(self) {
	  for (var i = 0; i < self._59.length; i++) {
	    handle(self, self._59[i]);
	  }
	  self._59 = null;
	}

	function Handler(onFulfilled, onRejected, promise){
	  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	  this.promise = promise;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, promise) {
	  var done = false;
	  var res = tryCallTwo(fn, function (value) {
	    if (done) return;
	    done = true;
	    resolve(promise, value);
	  }, function (reason) {
	    if (done) return;
	    done = true;
	    reject(promise, reason);
	  })
	  if (!done && res === IS_ERROR) {
	    done = true;
	    reject(promise, LAST_ERROR);
	  }
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	// Use the fastest means possible to execute a task in its own turn, with
	// priority over other events including IO, animation, reflow, and redraw
	// events in browsers.
	//
	// An exception thrown by a task will permanently interrupt the processing of
	// subsequent tasks. The higher level `asap` function ensures that if an
	// exception is thrown by a task, that the task queue will continue flushing as
	// soon as possible, but if you use `rawAsap` directly, you are responsible to
	// either ensure that no exceptions are thrown from your task, or to manually
	// call `rawAsap.requestFlush` if an exception is thrown.
	module.exports = rawAsap;
	function rawAsap(task) {
	    if (!queue.length) {
	        requestFlush();
	        flushing = true;
	    }
	    // Equivalent to push, but avoids a function call.
	    queue[queue.length] = task;
	}

	var queue = [];
	// Once a flush has been requested, no further calls to `requestFlush` are
	// necessary until the next `flush` completes.
	var flushing = false;
	// `requestFlush` is an implementation-specific method that attempts to kick
	// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
	// the event queue before yielding to the browser's own event loop.
	var requestFlush;
	// The position of the next task to execute in the task queue. This is
	// preserved between calls to `flush` so that it can be resumed if
	// a task throws an exception.
	var index = 0;
	// If a task schedules additional tasks recursively, the task queue can grow
	// unbounded. To prevent memory exhaustion, the task queue will periodically
	// truncate already-completed tasks.
	var capacity = 1024;

	// The flush function processes all tasks that have been scheduled with
	// `rawAsap` unless and until one of those tasks throws an exception.
	// If a task throws an exception, `flush` ensures that its state will remain
	// consistent and will resume where it left off when called again.
	// However, `flush` does not make any arrangements to be called again if an
	// exception is thrown.
	function flush() {
	    while (index < queue.length) {
	        var currentIndex = index;
	        // Advance the index before calling the task. This ensures that we will
	        // begin flushing on the next task the task throws an error.
	        index = index + 1;
	        queue[currentIndex].call();
	        // Prevent leaking memory for long chains of recursive calls to `asap`.
	        // If we call `asap` within tasks scheduled by `asap`, the queue will
	        // grow, but to avoid an O(n) walk for every task we execute, we don't
	        // shift tasks off the queue after they have been executed.
	        // Instead, we periodically shift 1024 tasks off the queue.
	        if (index > capacity) {
	            // Manually shift all values starting at the index back to the
	            // beginning of the queue.
	            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
	                queue[scan] = queue[scan + index];
	            }
	            queue.length -= index;
	            index = 0;
	        }
	    }
	    queue.length = 0;
	    index = 0;
	    flushing = false;
	}

	// `requestFlush` is implemented using a strategy based on data collected from
	// every available SauceLabs Selenium web driver worker at time of writing.
	// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

	// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
	// have WebKitMutationObserver but not un-prefixed MutationObserver.
	// Must use `global` or `self` instead of `window` to work in both frames and web
	// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

	/* globals self */
	var scope = typeof global !== "undefined" ? global : self;
	var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

	// MutationObservers are desirable because they have high priority and work
	// reliably everywhere they are implemented.
	// They are implemented in all modern browsers.
	//
	// - Android 4-4.3
	// - Chrome 26-34
	// - Firefox 14-29
	// - Internet Explorer 11
	// - iPad Safari 6-7.1
	// - iPhone Safari 7-7.1
	// - Safari 6-7
	if (typeof BrowserMutationObserver === "function") {
	    requestFlush = makeRequestCallFromMutationObserver(flush);

	// MessageChannels are desirable because they give direct access to the HTML
	// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
	// 11-12, and in web workers in many engines.
	// Although message channels yield to any queued rendering and IO tasks, they
	// would be better than imposing the 4ms delay of timers.
	// However, they do not work reliably in Internet Explorer or Safari.

	// Internet Explorer 10 is the only browser that has setImmediate but does
	// not have MutationObservers.
	// Although setImmediate yields to the browser's renderer, it would be
	// preferrable to falling back to setTimeout since it does not have
	// the minimum 4ms penalty.
	// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
	// Desktop to a lesser extent) that renders both setImmediate and
	// MessageChannel useless for the purposes of ASAP.
	// https://github.com/kriskowal/q/issues/396

	// Timers are implemented universally.
	// We fall back to timers in workers in most engines, and in foreground
	// contexts in the following browsers.
	// However, note that even this simple case requires nuances to operate in a
	// broad spectrum of browsers.
	//
	// - Firefox 3-13
	// - Internet Explorer 6-9
	// - iPad Safari 4.3
	// - Lynx 2.8.7
	} else {
	    requestFlush = makeRequestCallFromTimer(flush);
	}

	// `requestFlush` requests that the high priority event queue be flushed as
	// soon as possible.
	// This is useful to prevent an error thrown in a task from stalling the event
	// queue if the exception handled by Node.js’s
	// `process.on("uncaughtException")` or by a domain.
	rawAsap.requestFlush = requestFlush;

	// To request a high priority event, we induce a mutation observer by toggling
	// the text of a text node between "1" and "-1".
	function makeRequestCallFromMutationObserver(callback) {
	    var toggle = 1;
	    var observer = new BrowserMutationObserver(callback);
	    var node = document.createTextNode("");
	    observer.observe(node, {characterData: true});
	    return function requestCall() {
	        toggle = -toggle;
	        node.data = toggle;
	    };
	}

	// The message channel technique was discovered by Malte Ubl and was the
	// original foundation for this library.
	// http://www.nonblocking.io/2011/06/windownexttick.html

	// Safari 6.0.5 (at least) intermittently fails to create message ports on a
	// page's first load. Thankfully, this version of Safari supports
	// MutationObservers, so we don't need to fall back in that case.

	// function makeRequestCallFromMessageChannel(callback) {
	//     var channel = new MessageChannel();
	//     channel.port1.onmessage = callback;
	//     return function requestCall() {
	//         channel.port2.postMessage(0);
	//     };
	// }

	// For reasons explained above, we are also unable to use `setImmediate`
	// under any circumstances.
	// Even if we were, there is another bug in Internet Explorer 10.
	// It is not sufficient to assign `setImmediate` to `requestFlush` because
	// `setImmediate` must be called *by name* and therefore must be wrapped in a
	// closure.
	// Never forget.

	// function makeRequestCallFromSetImmediate(callback) {
	//     return function requestCall() {
	//         setImmediate(callback);
	//     };
	// }

	// Safari 6.0 has a problem where timers will get lost while the user is
	// scrolling. This problem does not impact ASAP because Safari 6.0 supports
	// mutation observers, so that implementation is used instead.
	// However, if we ever elect to use timers in Safari, the prevalent work-around
	// is to add a scroll event listener that calls for a flush.

	// `setTimeout` does not call the passed callback if the delay is less than
	// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
	// even then.

	function makeRequestCallFromTimer(callback) {
	    return function requestCall() {
	        // We dispatch a timeout with a specified delay of 0 for engines that
	        // can reliably accommodate that request. This will usually be snapped
	        // to a 4 milisecond delay, but once we're flushing, there's no delay
	        // between events.
	        var timeoutHandle = setTimeout(handleTimer, 0);
	        // However, since this timer gets frequently dropped in Firefox
	        // workers, we enlist an interval handle that will try to fire
	        // an event 20 times per second until it succeeds.
	        var intervalHandle = setInterval(handleTimer, 50);

	        function handleTimer() {
	            // Whichever timer succeeds will cancel both timers and
	            // execute the callback.
	            clearTimeout(timeoutHandle);
	            clearInterval(intervalHandle);
	            callback();
	        }
	    };
	}

	// This is for `asap.js` only.
	// Its name will be periodically randomized to break any code that depends on
	// its existence.
	rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

	// ASAP was originally a nextTick shim included in Q. This was factored out
	// into this ASAP package. It was later adapted to RSVP which made further
	// amendments. These decisions, particularly to marginalize MessageChannel and
	// to capture the MutationObserver implementation in a closure, were integrated
	// back into ASAP proper.
	// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(9);

	module.exports = Promise;
	Promise.prototype.done = function (onFulfilled, onRejected) {
	  var self = arguments.length ? this.then.apply(this, arguments) : this;
	  self.then(null, function (err) {
	    setTimeout(function () {
	      throw err;
	    }, 0);
	  });
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Promise = __webpack_require__(9);

	module.exports = Promise;
	Promise.prototype['finally'] = function (f) {
	  return this.then(function (value) {
	    return Promise.resolve(f()).then(function () {
	      return value;
	    });
	  }, function (err) {
	    return Promise.resolve(f()).then(function () {
	      throw err;
	    });
	  });
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//This file contains the ES6 extensions to the core Promises/A+ API

	var Promise = __webpack_require__(9);

	module.exports = Promise;

	/* Static Functions */

	var TRUE = valuePromise(true);
	var FALSE = valuePromise(false);
	var NULL = valuePromise(null);
	var UNDEFINED = valuePromise(undefined);
	var ZERO = valuePromise(0);
	var EMPTYSTRING = valuePromise('');

	function valuePromise(value) {
	  var p = new Promise(Promise._99);
	  p._37 = 1;
	  p._12 = value;
	  return p;
	}
	Promise.resolve = function (value) {
	  if (value instanceof Promise) return value;

	  if (value === null) return NULL;
	  if (value === undefined) return UNDEFINED;
	  if (value === true) return TRUE;
	  if (value === false) return FALSE;
	  if (value === 0) return ZERO;
	  if (value === '') return EMPTYSTRING;

	  if (typeof value === 'object' || typeof value === 'function') {
	    try {
	      var then = value.then;
	      if (typeof then === 'function') {
	        return new Promise(then.bind(value));
	      }
	    } catch (ex) {
	      return new Promise(function (resolve, reject) {
	        reject(ex);
	      });
	    }
	  }
	  return valuePromise(value);
	};

	Promise.all = function (arr) {
	  var args = Array.prototype.slice.call(arr);

	  return new Promise(function (resolve, reject) {
	    if (args.length === 0) return resolve([]);
	    var remaining = args.length;
	    function res(i, val) {
	      if (val && (typeof val === 'object' || typeof val === 'function')) {
	        if (val instanceof Promise && val.then === Promise.prototype.then) {
	          while (val._37 === 3) {
	            val = val._12;
	          }
	          if (val._37 === 1) return res(i, val._12);
	          if (val._37 === 2) reject(val._12);
	          val.then(function (val) {
	            res(i, val);
	          }, reject);
	          return;
	        } else {
	          var then = val.then;
	          if (typeof then === 'function') {
	            var p = new Promise(then.bind(val));
	            p.then(function (val) {
	              res(i, val);
	            }, reject);
	            return;
	          }
	        }
	      }
	      args[i] = val;
	      if (--remaining === 0) {
	        resolve(args);
	      }
	    }
	    for (var i = 0; i < args.length; i++) {
	      res(i, args[i]);
	    }
	  });
	};

	Promise.reject = function (value) {
	  return new Promise(function (resolve, reject) {
	    reject(value);
	  });
	};

	Promise.race = function (values) {
	  return new Promise(function (resolve, reject) {
	    values.forEach(function(value){
	      Promise.resolve(value).then(resolve, reject);
	    });
	  });
	};

	/* Prototype Methods */

	Promise.prototype['catch'] = function (onRejected) {
	  return this.then(null, onRejected);
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// This file contains then/promise specific extensions that are only useful
	// for node.js interop

	var Promise = __webpack_require__(9);
	var asap = __webpack_require__(15);

	module.exports = Promise;

	/* Static Functions */

	Promise.denodeify = function (fn, argumentCount) {
	  argumentCount = argumentCount || Infinity;
	  return function () {
	    var self = this;
	    var args = Array.prototype.slice.call(arguments, 0,
	        argumentCount > 0 ? argumentCount : 0);
	    return new Promise(function (resolve, reject) {
	      args.push(function (err, res) {
	        if (err) reject(err);
	        else resolve(res);
	      })
	      var res = fn.apply(self, args);
	      if (res &&
	        (
	          typeof res === 'object' ||
	          typeof res === 'function'
	        ) &&
	        typeof res.then === 'function'
	      ) {
	        resolve(res);
	      }
	    })
	  }
	}
	Promise.nodeify = function (fn) {
	  return function () {
	    var args = Array.prototype.slice.call(arguments);
	    var callback =
	      typeof args[args.length - 1] === 'function' ? args.pop() : null;
	    var ctx = this;
	    try {
	      return fn.apply(this, arguments).nodeify(callback, ctx);
	    } catch (ex) {
	      if (callback === null || typeof callback == 'undefined') {
	        return new Promise(function (resolve, reject) {
	          reject(ex);
	        });
	      } else {
	        asap(function () {
	          callback.call(ctx, ex);
	        })
	      }
	    }
	  }
	}

	Promise.prototype.nodeify = function (callback, ctx) {
	  if (typeof callback != 'function') return this;

	  this.then(function (value) {
	    asap(function () {
	      callback.call(ctx, null, value);
	    });
	  }, function (err) {
	    asap(function () {
	      callback.call(ctx, err);
	    });
	  });
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// rawAsap provides everything we need except exception management.
	var rawAsap = __webpack_require__(10);
	// RawTasks are recycled to reduce GC churn.
	var freeTasks = [];
	// We queue errors to ensure they are thrown in right order (FIFO).
	// Array-as-queue is good enough here, since we are just dealing with exceptions.
	var pendingErrors = [];
	var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

	function throwFirstError() {
	    if (pendingErrors.length) {
	        throw pendingErrors.shift();
	    }
	}

	/**
	 * Calls a task as soon as possible after returning, in its own event, with priority
	 * over other events like animation, reflow, and repaint. An error thrown from an
	 * event will not interrupt, nor even substantially slow down the processing of
	 * other events, but will be rather postponed to a lower priority event.
	 * @param {{call}} task A callable object, typically a function that takes no
	 * arguments.
	 */
	module.exports = asap;
	function asap(task) {
	    var rawTask;
	    if (freeTasks.length) {
	        rawTask = freeTasks.pop();
	    } else {
	        rawTask = new RawTask();
	    }
	    rawTask.task = task;
	    rawAsap(rawTask);
	}

	// We wrap tasks with recyclable task objects.  A task object implements
	// `call`, just like a function.
	function RawTask() {
	    this.task = null;
	}

	// The sole purpose of wrapping the task is to catch the exception and recycle
	// the task object after its single use.
	RawTask.prototype.call = function () {
	    try {
	        this.task.call();
	    } catch (error) {
	        if (asap.onerror) {
	            // This hook exists purely for testing purposes.
	            // Its name will be periodically randomized to break any code that
	            // depends on its existence.
	            asap.onerror(error);
	        } else {
	            // In a web browser, exceptions are not fatal. However, to avoid
	            // slowing down the queue of pending tasks, we rethrow the error in a
	            // lower priority turn.
	            pendingErrors.push(error);
	            requestErrorThrow();
	        }
	    } finally {
	        this.task = null;
	        freeTasks[freeTasks.length] = this;
	    }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * alertifyjs 1.8.0 http://alertifyjs.com
	 * AlertifyJS is a javascript framework for developing pretty browser dialogs and notifications.
	 * Copyright 2016 Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com) 
	 * Licensed under GPL 3 <https://opensource.org/licenses/gpl-3.0>*/
	( function ( window ) {
	    'use strict';
	    
	    /**
	     * Keys enum
	     * @type {Object}
	     */
	    var keys = {
	        ENTER: 13,
	        ESC: 27,
	        F1: 112,
	        F12: 123,
	        LEFT: 37,
	        RIGHT: 39
	    };
	    /**
	     * Default options 
	     * @type {Object}
	     */
	    var defaults = {
	        autoReset:true,
	        basic:false,
	        closable:true,
	        closableByDimmer:true,
	        frameless:false,
	        maintainFocus:true, //global default not per instance, applies to all dialogs
	        maximizable:true,
	        modal:true,
	        movable:true,
	        moveBounded:false,
	        overflow:true,
	        padding: true,
	        pinnable:true,
	        pinned:true,
	        preventBodyShift:false, //global default not per instance, applies to all dialogs
	        resizable:true,
	        startMaximized:false,
	        transition:'pulse',
	        notifier:{
	            delay:5,
	            position:'bottom-right'
	        },
	        glossary:{
	            title:'AlertifyJS',
	            ok: 'OK',
	            cancel: 'Cancel',
	            acccpt: 'Accept',
	            deny: 'Deny',
	            confirm: 'Confirm',
	            decline: 'Decline',
	            close: 'Close',
	            maximize: 'Maximize',
	            restore: 'Restore',
	        },
	        theme:{
	            input:'ajs-input',
	            ok:'ajs-ok',
	            cancel:'ajs-cancel',
	        }
	    };
	    
	    //holds open dialogs instances
	    var openDialogs = [];

	    /**
	     * [Helper]  Adds the specified class(es) to the element.
	     *
	     * @element {node}      The element
	     * @className {string}  One or more space-separated classes to be added to the class attribute of the element.
	     * 
	     * @return {undefined}
	     */
	    function addClass(element,classNames){
	        element.className += ' ' + classNames;
	    }
	    
	    /**
	     * [Helper]  Removes the specified class(es) from the element.
	     *
	     * @element {node}      The element
	     * @className {string}  One or more space-separated classes to be removed from the class attribute of the element.
	     * 
	     * @return {undefined}
	     */
	    function removeClass(element, classNames) {
	        var original = element.className.split(' ');
	        var toBeRemoved = classNames.split(' ');
	        for (var x = 0; x < toBeRemoved.length; x += 1) {
	            var index = original.indexOf(toBeRemoved[x]);
	            if (index > -1){
	                original.splice(index,1);
	            }
	        }
	        element.className = original.join(' ');
	    }

	    /**
	     * [Helper]  Checks if the document is RTL
	     *
	     * @return {Boolean} True if the document is RTL, false otherwise.
	     */
	    function isRightToLeft(){
	        return window.getComputedStyle(document.body).direction === 'rtl';
	    }
	    /**
	     * [Helper]  Get the document current scrollTop
	     *
	     * @return {Number} current document scrollTop value
	     */
	    function getScrollTop(){
	        return ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
	    }

	    /**
	     * [Helper]  Get the document current scrollLeft
	     *
	     * @return {Number} current document scrollLeft value
	     */
	    function getScrollLeft(){
	        return ((document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft);
	    }

	    /**
	    * Helper: clear contents
	    *
	    */
	    function clearContents(element){
	        while (element.lastChild) {
	            element.removeChild(element.lastChild);
	        }
	    }
	    /**
	     * Extends a given prototype by merging properties from base into sub.
	     *
	     * @sub {Object} sub The prototype being overwritten.
	     * @base {Object} base The prototype being written.
	     *
	     * @return {Object} The extended prototype.
	     */
	    function copy(src) {
	        if(null === src){
	            return src;
	        }
	        var cpy;
	        if(Array.isArray(src)){
	            cpy = [];
	            for(var x=0;x<src.length;x+=1){
	                cpy.push(copy(src[x]));
	            }
	            return cpy;
	        }
	      
	        if(src instanceof Date){
	            return new Date(src.getTime());
	        }
	      
	        if(src instanceof RegExp){
	            cpy = new RegExp(src.source);
	            cpy.global = src.global;
	            cpy.ignoreCase = src.ignoreCase;
	            cpy.multiline = src.multiline;
	            cpy.lastIndex = src.lastIndex;
	            return cpy;
	        }
	        
	        if(typeof src === 'object'){
	            cpy = {};
	            // copy dialog pototype over definition.
	            for (var prop in src) {
	                if (src.hasOwnProperty(prop)) {
	                    cpy[prop] = copy(src[prop]);
	                }
	            }
	            return cpy;
	        }
	        return src;
	    }
	    /**
	      * Helper: destruct the dialog
	      *
	      */
	    function destruct(instance, initialize){
	        //delete the dom and it's references.
	        var root = instance.elements.root;
	        root.parentNode.removeChild(root);
	        delete instance.elements;
	        //copy back initial settings.
	        instance.settings = copy(instance.__settings);
	        //re-reference init function.
	        instance.__init = initialize;
	        //delete __internal variable to allow re-initialization.
	        delete instance.__internal;
	    }

	    /**
	     * Use a closure to return proper event listener method. Try to use
	     * `addEventListener` by default but fallback to `attachEvent` for
	     * unsupported browser. The closure simply ensures that the test doesn't
	     * happen every time the method is called.
	     *
	     * @param    {Node}     el    Node element
	     * @param    {String}   event Event type
	     * @param    {Function} fn    Callback of event
	     * @return   {Function}
	     */
	    var on = (function () {
	        if (document.addEventListener) {
	            return function (el, event, fn, useCapture) {
	                el.addEventListener(event, fn, useCapture === true);
	            };
	        } else if (document.attachEvent) {
	            return function (el, event, fn) {
	                el.attachEvent('on' + event, fn);
	            };
	        }
	    }());

	    /**
	     * Use a closure to return proper event listener method. Try to use
	     * `removeEventListener` by default but fallback to `detachEvent` for
	     * unsupported browser. The closure simply ensures that the test doesn't
	     * happen every time the method is called.
	     *
	     * @param    {Node}     el    Node element
	     * @param    {String}   event Event type
	     * @param    {Function} fn    Callback of event
	     * @return   {Function}
	     */
	    var off = (function () {
	        if (document.removeEventListener) {
	            return function (el, event, fn, useCapture) {
	                el.removeEventListener(event, fn, useCapture === true);
	            };
	        } else if (document.detachEvent) {
	            return function (el, event, fn) {
	                el.detachEvent('on' + event, fn);
	            };
	        }
	    }());

	    /**
	     * Prevent default event from firing
	     *
	     * @param  {Event} event Event object
	     * @return {undefined}

	    function prevent ( event ) {
	        if ( event ) {
	            if ( event.preventDefault ) {
	                event.preventDefault();
	            } else {
	                event.returnValue = false;
	            }
	        }
	    }
	    */
	    var transition = (function () {
	        var t, type;
	        var supported = false;
	        var transitions = {
	            'animation'        : 'animationend',
	            'OAnimation'       : 'oAnimationEnd oanimationend',
	            'msAnimation'      : 'MSAnimationEnd',
	            'MozAnimation'     : 'animationend',
	            'WebkitAnimation'  : 'webkitAnimationEnd'
	        };

	        for (t in transitions) {
	            if (document.documentElement.style[t] !== undefined) {
	                type = transitions[t];
	                supported = true;
	                break;
	            }
	        }

	        return {
	            type: type,
	            supported: supported
	        };
	    }());

	    /**
	    * Creates event handler delegate that sends the instance as last argument.
	    * 
	    * @return {Function}    a function wrapper which sends the instance as last argument.
	    */
	    function delegate(context, method) {
	        return function () {
	            if (arguments.length > 0) {
	                var args = [];
	                for (var x = 0; x < arguments.length; x += 1) {
	                    args.push(arguments[x]);
	                }
	                args.push(context);
	                return method.apply(context, args);
	            }
	            return method.apply(context, [null, context]);
	        };
	    }
	    /**
	    * Helper for creating a dialog close event.
	    * 
	    * @return {object}
	    */
	    function createCloseEvent(index, button) {
	        return {
	            index: index,
	            button: button,
	            cancel: false
	        };
	    }
	    /**
	    * Helper for dispatching events.
	    *
	    * @param  {string} evenType The type of the event to disptach.
	    * @param  {object} instance The dialog instance disptaching the event.
	    *
	    * @return {object}
	    */
	    function dispatchEvent(eventType, instance) {
	        if ( typeof instance.get(eventType) === 'function' ) {
	            instance.get(eventType).call(instance);
	        }
	    }


	    /**
	     * Super class for all dialogs
	     *
	     * @return {Object}		base dialog prototype
	     */
	    var dialog = (function () {
	        var //holds the list of used keys.
	            usedKeys = [],
	            //dummy variable, used to trigger dom reflow.
	            reflow = null,
	            //condition for detecting safari
	            isSafari = window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') < 0,
	            //dialog building blocks
	            templates = {
	                dimmer:'<div class="ajs-dimmer"></div>',
	                /*tab index required to fire click event before body focus*/
	                modal: '<div class="ajs-modal" tabindex="0"></div>',
	                dialog: '<div class="ajs-dialog" tabindex="0"></div>',
	                reset: '<button class="ajs-reset"></button>',
	                commands: '<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',
	                header: '<div class="ajs-header"></div>',
	                body: '<div class="ajs-body"></div>',
	                content: '<div class="ajs-content"></div>',
	                footer: '<div class="ajs-footer"></div>',
	                buttons: { primary: '<div class="ajs-primary ajs-buttons"></div>', auxiliary: '<div class="ajs-auxiliary ajs-buttons"></div>' },
	                button: '<button class="ajs-button"></button>',
	                resizeHandle: '<div class="ajs-handle"></div>',
	            },
	            //common class names
	            classes = {
	                animationIn: 'ajs-in',
	                animationOut: 'ajs-out',
	                base: 'alertify',
	                basic:'ajs-basic',
	                capture: 'ajs-capture',
	                closable:'ajs-closable',
	                fixed: 'ajs-fixed',
	                frameless:'ajs-frameless',
	                hidden: 'ajs-hidden',
	                maximize: 'ajs-maximize',
	                maximized: 'ajs-maximized',
	                maximizable:'ajs-maximizable',
	                modeless: 'ajs-modeless',
	                movable: 'ajs-movable',
	                noSelection: 'ajs-no-selection',
	                noOverflow: 'ajs-no-overflow',
	                noPadding:'ajs-no-padding',
	                pin:'ajs-pin',
	                pinnable:'ajs-pinnable',
	                prefix: 'ajs-',
	                resizable: 'ajs-resizable',
	                restore: 'ajs-restore',
	                shake:'ajs-shake',
	                unpinned:'ajs-unpinned',
	            };

	        /**
	         * Helper: initializes the dialog instance
	         * 
	         * @return	{Number}	The total count of currently open modals.
	         */
	        function initialize(instance){
	            
	            if(!instance.__internal){

	                //no need to expose init after this.
	                delete instance.__init;
	              
	                //keep a copy of initial dialog settings
	                if(!instance.__settings){
	                    instance.__settings = copy(instance.settings);
	                }
	                //in case the script was included before body.
	                //after first dialog gets initialized, it won't be null anymore!
	                if(null === reflow){
	                    // set tabindex attribute on body element this allows script to give it
	                    // focus after the dialog is closed
	                    document.body.setAttribute( 'tabindex', '0' );
	                }

	                //get dialog buttons/focus setup
	                var setup;
	                if(typeof instance.setup === 'function'){
	                    setup = instance.setup();
	                    setup.options = setup.options  || {};
	                    setup.focus = setup.focus  || {};
	                }else{
	                    setup = {
	                        buttons:[],
	                        focus:{
	                            element:null,
	                            select:false
	                        },
	                        options:{
	                        }
	                    };
	                }
	                
	                //initialize hooks object.
	                if(typeof instance.hooks !== 'object'){
	                    instance.hooks = {};
	                }

	                //copy buttons defintion
	                var buttonsDefinition = [];
	                if(Array.isArray(setup.buttons)){
	                    for(var b=0;b<setup.buttons.length;b+=1){
	                        var ref  = setup.buttons[b],
	                            cpy = {};
	                        for (var i in ref) {
	                            if (ref.hasOwnProperty(i)) {
	                                cpy[i] = ref[i];
	                            }
	                        }
	                        buttonsDefinition.push(cpy);
	                    }
	                }

	                var internal = instance.__internal = {
	                    /**
	                     * Flag holding the open state of the dialog
	                     * 
	                     * @type {Boolean}
	                     */
	                    isOpen:false,
	                    /**
	                     * Active element is the element that will receive focus after
	                     * closing the dialog. It defaults as the body tag, but gets updated
	                     * to the last focused element before the dialog was opened.
	                     *
	                     * @type {Node}
	                     */
	                    activeElement:document.body,
	                    timerIn:undefined,
	                    timerOut:undefined,
	                    buttons: buttonsDefinition,
	                    focus: setup.focus,
	                    options: {
	                        title: undefined,
	                        modal: undefined,
	                        basic:undefined,
	                        frameless:undefined,
	                        pinned: undefined,
	                        movable: undefined,
	                        moveBounded:undefined,
	                        resizable: undefined,
	                        autoReset: undefined,
	                        closable: undefined,
	                        closableByDimmer: undefined,
	                        maximizable: undefined,
	                        startMaximized: undefined,
	                        pinnable: undefined,
	                        transition: undefined,
	                        padding:undefined,
	                        overflow:undefined,
	                        onshow:undefined,
	                        onclose:undefined,
	                        onfocus:undefined,
	                        onmove:undefined,
	                        onmoved:undefined,
	                        onresize:undefined,
	                        onresized:undefined,
	                        onmaximize:undefined,
	                        onmaximized:undefined,
	                        onrestore:undefined,
	                        onrestored:undefined
	                    },
	                    resetHandler:undefined,
	                    beginMoveHandler:undefined,
	                    beginResizeHandler:undefined,
	                    bringToFrontHandler:undefined,
	                    modalClickHandler:undefined,
	                    buttonsClickHandler:undefined,
	                    commandsClickHandler:undefined,
	                    transitionInHandler:undefined,
	                    transitionOutHandler:undefined,
	                    destroy:undefined
	                };

	                var elements = {};
	                //root node
	                elements.root = document.createElement('div');
	                
	                elements.root.className = classes.base + ' ' + classes.hidden + ' ';

	                elements.root.innerHTML = templates.dimmer + templates.modal;
	                
	                //dimmer
	                elements.dimmer = elements.root.firstChild;

	                //dialog
	                elements.modal = elements.root.lastChild;
	                elements.modal.innerHTML = templates.dialog;
	                elements.dialog = elements.modal.firstChild;
	                elements.dialog.innerHTML = templates.reset + templates.commands + templates.header + templates.body + templates.footer + templates.resizeHandle + templates.reset;

	                //reset links
	                elements.reset = [];
	                elements.reset.push(elements.dialog.firstChild);
	                elements.reset.push(elements.dialog.lastChild);
	                
	                //commands
	                elements.commands = {};
	                elements.commands.container = elements.reset[0].nextSibling;
	                elements.commands.pin = elements.commands.container.firstChild;
	                elements.commands.maximize = elements.commands.pin.nextSibling;
	                elements.commands.close = elements.commands.maximize.nextSibling;
	                
	                //header
	                elements.header = elements.commands.container.nextSibling;

	                //body
	                elements.body = elements.header.nextSibling;
	                elements.body.innerHTML = templates.content;
	                elements.content = elements.body.firstChild;

	                //footer
	                elements.footer = elements.body.nextSibling;
	                elements.footer.innerHTML = templates.buttons.auxiliary + templates.buttons.primary;
	                
	                //resize handle
	                elements.resizeHandle = elements.footer.nextSibling;

	                //buttons
	                elements.buttons = {};
	                elements.buttons.auxiliary = elements.footer.firstChild;
	                elements.buttons.primary = elements.buttons.auxiliary.nextSibling;
	                elements.buttons.primary.innerHTML = templates.button;
	                elements.buttonTemplate = elements.buttons.primary.firstChild;
	                //remove button template
	                elements.buttons.primary.removeChild(elements.buttonTemplate);
	                               
	                for(var x=0; x < instance.__internal.buttons.length; x+=1) {
	                    var button = instance.__internal.buttons[x];
	                    
	                    // add to the list of used keys.
	                    if(usedKeys.indexOf(button.key) < 0){
	                        usedKeys.push(button.key);
	                    }

	                    button.element = elements.buttonTemplate.cloneNode();
	                    button.element.innerHTML = button.text;
	                    if(typeof button.className === 'string' &&  button.className !== ''){
	                        addClass(button.element, button.className);
	                    }
	                    for(var key in button.attrs){
	                        if(key !== 'className' && button.attrs.hasOwnProperty(key)){
	                            button.element.setAttribute(key, button.attrs[key]);
	                        }
	                    }
	                    if(button.scope === 'auxiliary'){
	                        elements.buttons.auxiliary.appendChild(button.element);
	                    }else{
	                        elements.buttons.primary.appendChild(button.element);
	                    }
	                }
	                //make elements pubic
	                instance.elements = elements;
	                
	                //save event handlers delegates
	                internal.resetHandler = delegate(instance, onReset);
	                internal.beginMoveHandler = delegate(instance, beginMove);
	                internal.beginResizeHandler = delegate(instance, beginResize);
	                internal.bringToFrontHandler = delegate(instance, bringToFront);
	                internal.modalClickHandler = delegate(instance, modalClickHandler);
	                internal.buttonsClickHandler = delegate(instance, buttonsClickHandler);
	                internal.commandsClickHandler = delegate(instance, commandsClickHandler);
	                internal.transitionInHandler = delegate(instance, handleTransitionInEvent);
	                internal.transitionOutHandler = delegate(instance, handleTransitionOutEvent);

	                //settings
	                for(var opKey in internal.options){
	                    if(setup.options[opKey] !== undefined){
	                        // if found in user options
	                        instance.set(opKey, setup.options[opKey]);
	                    }else if(alertify.defaults.hasOwnProperty(opKey)) {
	                        // else if found in defaults options
	                        instance.set(opKey, alertify.defaults[opKey]);
	                    }else if(opKey === 'title' ) {
	                        // else if title key, use alertify.defaults.glossary
	                        instance.set(opKey, alertify.defaults.glossary[opKey]);
	                    }
	                }

	                // allow dom customization
	                if(typeof instance.build === 'function'){
	                    instance.build();
	                }
	            }
	            
	            //add to the end of the DOM tree.
	            document.body.appendChild(instance.elements.root);
	        }

	        /**
	         * Helper: maintains scroll position
	         *
	         */
	        var scrollX, scrollY;
	        function saveScrollPosition(){
	            scrollX = getScrollLeft();
	            scrollY = getScrollTop();
	        }
	        function restoreScrollPosition(){
	            window.scrollTo(scrollX, scrollY);
	        }

	        /**
	         * Helper: adds/removes no-overflow class from body
	         *
	         */
	        function ensureNoOverflow(){
	            var requiresNoOverflow = 0;
	            for(var x=0;x<openDialogs.length;x+=1){
	                var instance = openDialogs[x];
	                if(instance.isModal() || instance.isMaximized()){
	                    requiresNoOverflow+=1;
	                }
	            }
	            if(requiresNoOverflow === 0 && document.body.className.indexOf(classes.noOverflow) >= 0){
	                //last open modal or last maximized one
	                removeClass(document.body, classes.noOverflow);
	                preventBodyShift(false);
	            }else if(requiresNoOverflow > 0 && document.body.className.indexOf(classes.noOverflow) < 0){
	                //first open modal or first maximized one
	                preventBodyShift(true);
	                addClass(document.body, classes.noOverflow);
	            }
	        }
	        var top = '', topScroll = 0;
	        /**
	         * Helper: prevents body shift.
	         *
	         */
	        function preventBodyShift(add){
	            if(alertify.defaults.preventBodyShift && document.documentElement.scrollHeight > document.documentElement.clientHeight){
	                if(add ){//&& openDialogs[openDialogs.length-1].elements.dialog.clientHeight <= document.documentElement.clientHeight){
	                    topScroll = scrollY;
	                    top = window.getComputedStyle(document.body).top;
	                    addClass(document.body, classes.fixed);
	                    document.body.style.top = -scrollY + 'px';
	                } else {
	                    scrollY = topScroll;
	                    document.body.style.top = top;
	                    removeClass(document.body, classes.fixed);
	                    restoreScrollPosition();
	                }
	            }
	        }
			
	        /**
	         * Sets the name of the transition used to show/hide the dialog
	         * 
	         * @param {Object} instance The dilog instance.
	         *
	         */
	        function updateTransition(instance, value, oldValue){
	            if(typeof oldValue === 'string'){
	                removeClass(instance.elements.root,classes.prefix +  oldValue);
	            }
	            addClass(instance.elements.root, classes.prefix + value);
	            reflow = instance.elements.root.offsetWidth;
	        }
			
	        /**
	         * Toggles the dialog display mode
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function updateDisplayMode(instance){
	            if(instance.get('modal')){

	                //make modal
	                removeClass(instance.elements.root, classes.modeless);

	                //only if open
	                if(instance.isOpen()){
	                    unbindModelessEvents(instance);

	                    //in case a pinned modless dialog was made modal while open.
	                    updateAbsPositionFix(instance);

	                    ensureNoOverflow();
	                }
	            }else{
	                //make modelss
	                addClass(instance.elements.root, classes.modeless);

	                //only if open
	                if(instance.isOpen()){
	                    bindModelessEvents(instance);

	                    //in case pin/unpin was called while a modal is open
	                    updateAbsPositionFix(instance);

	                    ensureNoOverflow();
	                }
	            }
	        }

	        /**
	         * Toggles the dialog basic view mode 
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function updateBasicMode(instance){
	            if (instance.get('basic')) {
	                // add class
	                addClass(instance.elements.root, classes.basic);
	            } else {
	                // remove class
	                removeClass(instance.elements.root, classes.basic);
	            }
	        }

	        /**
	         * Toggles the dialog frameless view mode 
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function updateFramelessMode(instance){
	            if (instance.get('frameless')) {
	                // add class
	                addClass(instance.elements.root, classes.frameless);
	            } else {
	                // remove class
	                removeClass(instance.elements.root, classes.frameless);
	            }
	        }
			
	        /**
	         * Helper: Brings the modeless dialog to front, attached to modeless dialogs.
	         *
	         * @param {Event} event Focus event
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bringToFront(event, instance){
	            
	            // Do not bring to front if preceeded by an open modal
	            var index = openDialogs.indexOf(instance);
	            for(var x=index+1;x<openDialogs.length;x+=1){
	                if(openDialogs[x].isModal()){
	                    return;
	                }
	            }
				
	            // Bring to front by making it the last child.
	            if(document.body.lastChild !== instance.elements.root){
	                document.body.appendChild(instance.elements.root);
	                //also make sure its at the end of the list
	                openDialogs.splice(openDialogs.indexOf(instance),1);
	                openDialogs.push(instance);
	                setFocus(instance);
	            }
				
	            return false;
	        }
			
	        /**
	         * Helper: reflects dialogs options updates
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {String} option The updated option name.
	         *
	         * @return	{undefined}	
	         */
	        function optionUpdated(instance, option, oldValue, newValue){
	            switch(option){
	            case 'title':
	                instance.setHeader(newValue);
	                break;
	            case 'modal':
	                updateDisplayMode(instance);
	                break;
	            case 'basic':
	                updateBasicMode(instance);
	                break;
	            case 'frameless':
	                updateFramelessMode(instance);
	                break;
	            case 'pinned':
	                updatePinned(instance);
	                break;
	            case 'closable':
	                updateClosable(instance);
	                break;
	            case 'maximizable':
	                updateMaximizable(instance);
	                break;
	            case 'pinnable':
	                updatePinnable(instance);
	                break;
	            case 'movable':
	                updateMovable(instance);
	                break;
	            case 'resizable':
	                updateResizable(instance);
	                break;
	            case 'transition':
	                updateTransition(instance,newValue, oldValue);
	                break;
	            case 'padding':
	                if(newValue){
	                    removeClass(instance.elements.root, classes.noPadding);
	                }else if(instance.elements.root.className.indexOf(classes.noPadding) < 0){
	                    addClass(instance.elements.root, classes.noPadding);
	                }
	                break;
	            case 'overflow':
	                if(newValue){
	                    removeClass(instance.elements.root, classes.noOverflow);
	                }else if(instance.elements.root.className.indexOf(classes.noOverflow) < 0){
	                    addClass(instance.elements.root, classes.noOverflow);
	                }
	                break;
	            case 'transition':
	                updateTransition(instance,newValue, oldValue);
	                break;
	            }

	            // internal on option updated event
	            if(typeof instance.hooks.onupdate === 'function'){
	                instance.hooks.onupdate.call(instance, option, oldValue, newValue);
	            }
	        }
			
	        /**
	         * Helper: reflects dialogs options updates
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Object} obj The object to set/get a value on/from.
	         * @param {Function} callback The callback function to call if the key was found.
	         * @param {String|Object} key A string specifying a propery name or a collection of key value pairs.
	         * @param {Object} value Optional, the value associated with the key (in case it was a string).
	         * @param {String} option The updated option name.
	         *
	         * @return	{Object} result object 
	         *	The result objects has an 'op' property, indicating of this is a SET or GET operation.
	         *		GET: 
	         *		- found: a flag indicating if the key was found or not.
	         *		- value: the property value.
	         *		SET:
	         *		- items: a list of key value pairs of the properties being set.
	         *				each contains:
	         *					- found: a flag indicating if the key was found or not.
	         *					- key: the property key.
	         *					- value: the property value.
	         */
	        function update(instance, obj, callback, key, value){
	            var result = {op:undefined, items: [] };
	            if(typeof value === 'undefined' && typeof key === 'string') {
	                //get
	                result.op = 'get';
	                if(obj.hasOwnProperty(key)){
	                    result.found = true;
	                    result.value = obj[key];
	                }else{
	                    result.found = false;
	                    result.value = undefined;
	                }
	            }
	            else
	            {
	                var old;
	                //set
	                result.op = 'set';
	                if(typeof key === 'object'){
	                    //set multiple
	                    var args = key;
	                    for (var prop in args) {
	                        if (obj.hasOwnProperty(prop)) {
	                            if(obj[prop] !== args[prop]){
	                                old = obj[prop];
	                                obj[prop] = args[prop];
	                                callback.call(instance,prop, old, args[prop]);
	                            }
	                            result.items.push({ 'key': prop, 'value': args[prop], 'found':true});
	                        }else{
	                            result.items.push({ 'key': prop, 'value': args[prop], 'found':false});
	                        }
	                    }
	                } else if (typeof key === 'string'){
	                    //set single
	                    if (obj.hasOwnProperty(key)) {
	                        if(obj[key] !== value){
	                            old  = obj[key];
	                            obj[key] = value;
	                            callback.call(instance,key, old, value);
	                        }
	                        result.items.push({'key': key, 'value': value , 'found':true});

	                    }else{
	                        result.items.push({'key': key, 'value': value , 'found':false});
	                    }
	                } else {
	                    //invalid params
	                    throw new Error('args must be a string or object');
	                }
	            }
	            return result;
	        }


	        /**
	         * Triggers a close event.
	         *
	         * @param {Object} instance	The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function triggerClose(instance) {
	            var found;
	            triggerCallback(instance, function (button) {
	                return found = (button.invokeOnClose === true);
	            });
	            //none of the buttons registered as onclose callback
	            //close the dialog
	            if (!found && instance.isOpen()) {
	                instance.close();
	            }
	        }

	        /**
	         * Dialogs commands event handler, attached to the dialog commands element.
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Object} instance	The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function commandsClickHandler(event, instance) {
	            var target = event.srcElement || event.target;
	            switch (target) {
	            case instance.elements.commands.pin:
	                if (!instance.isPinned()) {
	                    pin(instance);
	                } else {
	                    unpin(instance);
	                }
	                break;
	            case instance.elements.commands.maximize:
	                if (!instance.isMaximized()) {
	                    maximize(instance);
	                } else {
	                    restore(instance);
	                }
	                break;
	            case instance.elements.commands.close:
	                triggerClose(instance);
	                break;
	            }
	            return false;
	        }

	        /**
	         * Helper: pins the modeless dialog.
	         *
	         * @param {Object} instance	The dialog instance.
	         * 
	         * @return {undefined}
	         */
	        function pin(instance) {
	            //pin the dialog
	            instance.set('pinned', true);
	        }

	        /**
	         * Helper: unpins the modeless dialog.
	         *
	         * @param {Object} instance	The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function unpin(instance) {
	            //unpin the dialog 
	            instance.set('pinned', false);
	        }


	        /**
	         * Helper: enlarges the dialog to fill the entire screen.
	         *
	         * @param {Object} instance	The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function maximize(instance) {
	            // allow custom `onmaximize` method
	            dispatchEvent('onmaximize', instance);
	            //maximize the dialog 
	            addClass(instance.elements.root, classes.maximized);
	            if (instance.isOpen()) {
	                ensureNoOverflow();
	            }
	            // allow custom `onmaximized` method
	            dispatchEvent('onmaximized', instance);
	        }

	        /**
	         * Helper: returns the dialog to its former size.
	         *
	         * @param {Object} instance	The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function restore(instance) {
	            // allow custom `onrestore` method
	            dispatchEvent('onrestore', instance);
	            //maximize the dialog 
	            removeClass(instance.elements.root, classes.maximized);
	            if (instance.isOpen()) {
	                ensureNoOverflow();
	            }
	            // allow custom `onrestored` method
	            dispatchEvent('onrestored', instance);
	        }

	        /**
	         * Show or hide the maximize box.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to add the behavior, removes it otherwise.
	         *
	         * @return {undefined}
	         */
	        function updatePinnable(instance) {
	            if (instance.get('pinnable')) {
	                // add class
	                addClass(instance.elements.root, classes.pinnable);
	            } else {
	                // remove class
	                removeClass(instance.elements.root, classes.pinnable);
	            }
	        }

	        /**
	         * Helper: Fixes the absolutly positioned modal div position.
	         *
	         * @param {Object} instance The dialog instance.
	         *
	         * @return {undefined}
	         */
	        function addAbsPositionFix(instance) {
	            var scrollLeft = getScrollLeft();
	            instance.elements.modal.style.marginTop = getScrollTop() + 'px';
	            instance.elements.modal.style.marginLeft = scrollLeft + 'px';
	            instance.elements.modal.style.marginRight = (-scrollLeft) + 'px';
	        }

	        /**
	         * Helper: Removes the absolutly positioned modal div position fix.
	         *
	         * @param {Object} instance The dialog instance.
	         *
	         * @return {undefined}
	         */
	        function removeAbsPositionFix(instance) {
	            var marginTop = parseInt(instance.elements.modal.style.marginTop, 10);
	            var marginLeft = parseInt(instance.elements.modal.style.marginLeft, 10);
	            instance.elements.modal.style.marginTop = '';
	            instance.elements.modal.style.marginLeft = '';
	            instance.elements.modal.style.marginRight = '';

	            if (instance.isOpen()) {
	                var top = 0,
	                    left = 0
	                ;
	                if (instance.elements.dialog.style.top !== '') {
	                    top = parseInt(instance.elements.dialog.style.top, 10);
	                }
	                instance.elements.dialog.style.top = (top + (marginTop - getScrollTop())) + 'px';

	                if (instance.elements.dialog.style.left !== '') {
	                    left = parseInt(instance.elements.dialog.style.left, 10);
	                }
	                instance.elements.dialog.style.left = (left + (marginLeft - getScrollLeft())) + 'px';
	            }
	        }
	        /**
	         * Helper: Adds/Removes the absolutly positioned modal div position fix based on its pinned setting.
	         *
	         * @param {Object} instance The dialog instance.
	         *
	         * @return {undefined}
	         */
	        function updateAbsPositionFix(instance) {
	            // if modeless and unpinned add fix
	            if (!instance.get('modal') && !instance.get('pinned')) {
	                addAbsPositionFix(instance);
	            } else {
	                removeAbsPositionFix(instance);
	            }
	        }
	        /**
	         * Toggles the dialog position lock | modeless only.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to make it modal, false otherwise.
	         *
	         * @return {undefined}
	         */
	        function updatePinned(instance) {
	            if (instance.get('pinned')) {
	                removeClass(instance.elements.root, classes.unpinned);
	                if (instance.isOpen()) {
	                    removeAbsPositionFix(instance);
	                }
	            } else {
	                addClass(instance.elements.root, classes.unpinned);
	                if (instance.isOpen() && !instance.isModal()) {
	                    addAbsPositionFix(instance);
	                }
	            }
	        }

	        /**
	         * Show or hide the maximize box.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to add the behavior, removes it otherwise.
	         *
	         * @return {undefined}
	         */
	        function updateMaximizable(instance) {
	            if (instance.get('maximizable')) {
	                // add class
	                addClass(instance.elements.root, classes.maximizable);
	            } else {
	                // remove class
	                removeClass(instance.elements.root, classes.maximizable);
	            }
	        }

	        /**
	         * Show or hide the close box.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to add the behavior, removes it otherwise.
	         *
	         * @return {undefined}
	         */
	        function updateClosable(instance) {
	            if (instance.get('closable')) {
	                // add class
	                addClass(instance.elements.root, classes.closable);
	                bindClosableEvents(instance);
	            } else {
	                // remove class
	                removeClass(instance.elements.root, classes.closable);
	                unbindClosableEvents(instance);
	            }
	        }

	        // flag to cancel click event if already handled by end resize event (the mousedown, mousemove, mouseup sequence fires a click event.).
	        var cancelClick = false;

	        /**
	         * Helper: closes the modal dialog when clicking the modal
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function modalClickHandler(event, instance) {
	            var target = event.srcElement || event.target;
	            if (!cancelClick && target === instance.elements.modal && instance.get('closableByDimmer') === true) {
	                triggerClose(instance);
	            }
	            cancelClick = false;
	            return false;
	        }

	        // flag to cancel keyup event if already handled by click event (pressing Enter on a focusted button).
	        var cancelKeyup = false;
	        /** 
	         * Helper: triggers a button callback
	         *
	         * @param {Object}		The dilog instance.
	         * @param {Function}	Callback to check which button triggered the event.
	         *
	         * @return {undefined}
	         */
	        function triggerCallback(instance, check) {
	            for (var idx = 0; idx < instance.__internal.buttons.length; idx += 1) {
	                var button = instance.__internal.buttons[idx];
	                if (!button.element.disabled && check(button)) {
	                    var closeEvent = createCloseEvent(idx, button);
	                    if (typeof instance.callback === 'function') {
	                        instance.callback.apply(instance, [closeEvent]);
	                    }
	                    //close the dialog only if not canceled.
	                    if (closeEvent.cancel === false) {
	                        instance.close();
	                    }
	                    break;
	                }
	            }
	        }

	        /**
	         * Clicks event handler, attached to the dialog footer.
	         *
	         * @param {Event}		DOM event object.
	         * @param {Object}		The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function buttonsClickHandler(event, instance) {
	            var target = event.srcElement || event.target;
	            triggerCallback(instance, function (button) {
	                // if this button caused the click, cancel keyup event
	                return button.element === target && (cancelKeyup = true);
	            });
	        }

	        /**
	         * Keyup event handler, attached to the document.body
	         *
	         * @param {Event}		DOM event object.
	         * @param {Object}		The dilog instance.
	         * 
	         * @return {undefined}
	         */
	        function keyupHandler(event) {
	            //hitting enter while button has focus will trigger keyup too.
	            //ignore if handled by clickHandler
	            if (cancelKeyup) {
	                cancelKeyup = false;
	                return;
	            }
	            var instance = openDialogs[openDialogs.length - 1];
	            var keyCode = event.keyCode;
	            if (instance.__internal.buttons.length === 0 && keyCode === keys.ESC && instance.get('closable') === true) {
	                triggerClose(instance);
	                return false;
	            }else if (usedKeys.indexOf(keyCode) > -1) {
	                triggerCallback(instance, function (button) {
	                    return button.key === keyCode;
	                });
	                return false;
	            }
	        }
	        /**
	        * Keydown event handler, attached to the document.body
	        *
	        * @param {Event}		DOM event object.
	        * @param {Object}		The dilog instance.
	        * 
	        * @return {undefined}
	        */
	        function keydownHandler(event) {
	            var instance = openDialogs[openDialogs.length - 1];
	            var keyCode = event.keyCode;
	            if (keyCode === keys.LEFT || keyCode === keys.RIGHT) {
	                var buttons = instance.__internal.buttons;
	                for (var x = 0; x < buttons.length; x += 1) {
	                    if (document.activeElement === buttons[x].element) {
	                        switch (keyCode) {
	                        case keys.LEFT:
	                            buttons[(x || buttons.length) - 1].element.focus();
	                            return;
	                        case keys.RIGHT:
	                            buttons[(x + 1) % buttons.length].element.focus();
	                            return;
	                        }
	                    }
	                }
	            }else if (keyCode < keys.F12 + 1 && keyCode > keys.F1 - 1 && usedKeys.indexOf(keyCode) > -1) {
	                event.preventDefault();
	                event.stopPropagation();
	                triggerCallback(instance, function (button) {
	                    return button.key === keyCode;
	                });
	                return false;
	            }
	        }


	        /**
	         * Sets focus to proper dialog element
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Node} [resetTarget=undefined] DOM element to reset focus to.
	         *
	         * @return {undefined}
	         */
	        function setFocus(instance, resetTarget) {
	            // reset target has already been determined.
	            if (resetTarget) {
	                resetTarget.focus();
	            } else {
	                // current instance focus settings
	                var focus = instance.__internal.focus;
	                // the focus element.
	                var element = focus.element;

	                switch (typeof focus.element) {
	                // a number means a button index
	                case 'number':
	                    if (instance.__internal.buttons.length > focus.element) {
	                        //in basic view, skip focusing the buttons.
	                        if (instance.get('basic') === true) {
	                            element = instance.elements.reset[0];
	                        } else {
	                            element = instance.__internal.buttons[focus.element].element;
	                        }
	                    }
	                    break;
	                // a string means querySelector to select from dialog body contents.
	                case 'string':
	                    element = instance.elements.body.querySelector(focus.element);
	                    break;
	                // a function should return the focus element.
	                case 'function':
	                    element = focus.element.call(instance);
	                    break;
	                }
	                
	                // if no focus element, default to first reset element.
	                if ((typeof element === 'undefined' || element === null) && instance.__internal.buttons.length === 0) {
	                    element = instance.elements.reset[0];
	                }
	                // focus
	                if (element && element.focus) {
	                    element.focus();
	                    // if selectable
	                    if (focus.select && element.select) {
	                        element.select();
	                    }
	                }
	            }
	        }

	        /**
	         * Focus event handler, attached to document.body and dialogs own reset links.
	         * handles the focus for modal dialogs only.
	         *
	         * @param {Event} event DOM focus event object.
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function onReset(event, instance) {

	            // should work on last modal if triggered from document.body 
	            if (!instance) {
	                for (var x = openDialogs.length - 1; x > -1; x -= 1) {
	                    if (openDialogs[x].isModal()) {
	                        instance = openDialogs[x];
	                        break;
	                    }
	                }
	            }
	            // if modal
	            if (instance && instance.isModal()) {
	                // determine reset target to enable forward/backward tab cycle.
	                var resetTarget, target = event.srcElement || event.target;
	                var lastResetElement = target === instance.elements.reset[1] || (instance.__internal.buttons.length === 0 && target === document.body);

	                // if last reset link, then go to maximize or close
	                if (lastResetElement) {
	                    if (instance.get('maximizable')) {
	                        resetTarget = instance.elements.commands.maximize;
	                    } else if (instance.get('closable')) {
	                        resetTarget = instance.elements.commands.close;
	                    }
	                }
	                // if no reset target found, try finding the best button
	                if (resetTarget === undefined) {
	                    if (typeof instance.__internal.focus.element === 'number') {
	                        // button focus element, go to first available button
	                        if (target === instance.elements.reset[0]) {
	                            resetTarget = instance.elements.buttons.auxiliary.firstChild || instance.elements.buttons.primary.firstChild;
	                        } else if (lastResetElement) {
	                            //restart the cycle by going to first reset link
	                            resetTarget = instance.elements.reset[0];
	                        }
	                    } else {
	                        // will reach here when tapping backwards, so go to last child
	                        // The focus element SHOULD NOT be a button (logically!).
	                        if (target === instance.elements.reset[0]) {
	                            resetTarget = instance.elements.buttons.primary.lastChild || instance.elements.buttons.auxiliary.lastChild;
	                        }
	                    }
	                }
	                // focus
	                setFocus(instance, resetTarget);
	            }
	        }
	        /**
	         * Transition in transitionend event handler. 
	         *
	         * @param {Event}		TransitionEnd event object.
	         * @param {Object}		The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function handleTransitionInEvent(event, instance) {
	            // clear the timer
	            clearTimeout(instance.__internal.timerIn);

	            // once transition is complete, set focus
	            setFocus(instance);

	            //restore scroll to prevent document jump
	            restoreScrollPosition();

	            // allow handling key up after transition ended.
	            cancelKeyup = false;

	            // allow custom `onfocus` method
	            dispatchEvent('onfocus', instance);

	            // unbind the event
	            off(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

	            removeClass(instance.elements.root, classes.animationIn);
	        }

	        /**
	         * Transition out transitionend event handler. 
	         *
	         * @param {Event}		TransitionEnd event object.
	         * @param {Object}		The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function handleTransitionOutEvent(event, instance) {
	            // clear the timer
	            clearTimeout(instance.__internal.timerOut);
	            // unbind the event
	            off(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

	            // reset move updates
	            resetMove(instance);
	            // reset resize updates
	            resetResize(instance);

	            // restore if maximized
	            if (instance.isMaximized() && !instance.get('startMaximized')) {
	                restore(instance);
	            }

	            // return focus to the last active element
	            if (alertify.defaults.maintainFocus && instance.__internal.activeElement) {
	                instance.__internal.activeElement.focus();
	                instance.__internal.activeElement = null;
	            }
	            
	            //destory the instance
	            if (typeof instance.__internal.destroy === 'function') {
	                instance.__internal.destroy.apply(instance);
	            }
	        }
	        /* Controls moving a dialog around */
	        //holde the current moving instance
	        var movable = null,
	            //holds the current X offset when move starts
	            offsetX = 0,
	            //holds the current Y offset when move starts
	            offsetY = 0,
	            xProp = 'pageX',
	            yProp = 'pageY',
	            bounds = null,
	            refreshTop = false,
	            moveDelegate = null
	        ;

	        /**
	         * Helper: sets the element top/left coordinates
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Node} element The element being moved.
	         * 
	         * @return {undefined}
	         */
	        function moveElement(event, element) {
	            var left = (event[xProp] - offsetX),
	                top  = (event[yProp] - offsetY);

	            if(refreshTop){
	                top -= document.body.scrollTop;
	            }
	           
	            element.style.left = left + 'px';
	            element.style.top = top + 'px';
	           
	        }
	        /**
	         * Helper: sets the element top/left coordinates within screen bounds
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Node} element The element being moved.
	         * 
	         * @return {undefined}
	         */
	        function moveElementBounded(event, element) {
	            var left = (event[xProp] - offsetX),
	                top  = (event[yProp] - offsetY);

	            if(refreshTop){
	                top -= document.body.scrollTop;
	            }
	            
	            element.style.left = Math.min(bounds.maxLeft, Math.max(bounds.minLeft, left)) + 'px';
	            if(refreshTop){
	                element.style.top = Math.min(bounds.maxTop, Math.max(bounds.minTop, top)) + 'px';
	            }else{
	                element.style.top = Math.max(bounds.minTop, top) + 'px';
	            }
	        }
	            

	        /**
	         * Triggers the start of a move event, attached to the header element mouse down event.
	         * Adds no-selection class to the body, disabling selection while moving.
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Object} instance The dilog instance.
	         * 
	         * @return {Boolean} false
	         */
	        function beginMove(event, instance) {
	            if (resizable === null && !instance.isMaximized() && instance.get('movable')) {
	                var eventSrc, left=0, top=0;
	                if (event.type === 'touchstart') {
	                    event.preventDefault();
	                    eventSrc = event.targetTouches[0];
	                    xProp = 'clientX';
	                    yProp = 'clientY';
	                } else if (event.button === 0) {
	                    eventSrc = event;
	                }

	                if (eventSrc) {

	                    var element = instance.elements.dialog;
	                    addClass(element, classes.capture);

	                    if (element.style.left) {
	                        left = parseInt(element.style.left, 10);
	                    }

	                    if (element.style.top) {
	                        top = parseInt(element.style.top, 10);
	                    }
	                    
	                    offsetX = eventSrc[xProp] - left;
	                    offsetY = eventSrc[yProp] - top;

	                    if(instance.isModal()){
	                        offsetY += instance.elements.modal.scrollTop;
	                    }else if(instance.isPinned()){
	                        offsetY -= document.body.scrollTop;
	                    }
	                    
	                    if(instance.get('moveBounded')){
	                        var current = element,
	                            offsetLeft = -left,
	                            offsetTop = -top;
	                        
	                        //calc offset
	                        do {
	                            offsetLeft += current.offsetLeft;
	                            offsetTop += current.offsetTop;
	                        } while (current = current.offsetParent);
	                        
	                        bounds = {
	                            maxLeft : offsetLeft,
	                            minLeft : -offsetLeft,
	                            maxTop  : document.documentElement.clientHeight - element.clientHeight - offsetTop,
	                            minTop  : -offsetTop
	                        };
	                        moveDelegate = moveElementBounded;
	                    }else{
	                        bounds = null;
	                        moveDelegate = moveElement;
	                    }
	                    
	                    // allow custom `onmove` method
	                    dispatchEvent('onmove', instance);

	                    refreshTop = !instance.isModal() && instance.isPinned();
	                    movable = instance;
	                    moveDelegate(eventSrc, element);
	                    addClass(document.body, classes.noSelection);
	                    return false;
	                }
	            }
	        }

	        /**
	         * The actual move handler,  attached to document.body mousemove event.
	         *
	         * @param {Event} event	DOM event object.
	         * 
	         * @return {undefined}
	         */
	        function move(event) {
	            if (movable) {
	                var eventSrc;
	                if (event.type === 'touchmove') {
	                    event.preventDefault();
	                    eventSrc = event.targetTouches[0];
	                } else if (event.button === 0) {
	                    eventSrc = event;
	                }
	                if (eventSrc) {
	                    moveDelegate(eventSrc, movable.elements.dialog);
	                }
	            }
	        }

	        /**
	         * Triggers the end of a move event,  attached to document.body mouseup event.
	         * Removes no-selection class from document.body, allowing selection.
	         *
	         * @return {undefined}
	         */
	        function endMove() {
	            if (movable) {
	                var instance = movable;
	                movable = bounds = null;
	                removeClass(document.body, classes.noSelection);
	                removeClass(instance.elements.dialog, classes.capture);
	                // allow custom `onmoved` method
	                dispatchEvent('onmoved', instance);
	            }
	        }

	        /**
	         * Resets any changes made by moving the element to its original state,
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function resetMove(instance) {
	            movable = null;
	            var element = instance.elements.dialog;
	            element.style.left = element.style.top = '';
	        }

	        /**
	         * Updates the dialog move behavior.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to add the behavior, removes it otherwise.
	         *
	         * @return {undefined}
	         */
	        function updateMovable(instance) {
	            if (instance.get('movable')) {
	                // add class
	                addClass(instance.elements.root, classes.movable);
	                if (instance.isOpen()) {
	                    bindMovableEvents(instance);
	                }
	            } else {

	                //reset
	                resetMove(instance);
	                // remove class
	                removeClass(instance.elements.root, classes.movable);
	                if (instance.isOpen()) {
	                    unbindMovableEvents(instance);
	                }
	            }
	        }

	        /* Controls moving a dialog around */
	        //holde the current instance being resized		
	        var resizable = null,
	            //holds the staring left offset when resize starts.
	            startingLeft = Number.Nan,
	            //holds the staring width when resize starts.
	            startingWidth = 0,
	            //holds the initial width when resized for the first time.
	            minWidth = 0,
	            //holds the offset of the resize handle.
	            handleOffset = 0
	        ;

	        /**
	         * Helper: sets the element width/height and updates left coordinate if neccessary.
	         *
	         * @param {Event} event	DOM mousemove event object.
	         * @param {Node} element The element being moved.
	         * @param {Boolean} pinned A flag indicating if the element being resized is pinned to the screen.
	         * 
	         * @return {undefined}
	         */
	        function resizeElement(event, element, pageRelative) {

	            //calculate offsets from 0,0
	            var current = element;
	            var offsetLeft = 0;
	            var offsetTop = 0;
	            do {
	                offsetLeft += current.offsetLeft;
	                offsetTop += current.offsetTop;
	            } while (current = current.offsetParent);

	            // determine X,Y coordinates.
	            var X, Y;
	            if (pageRelative === true) {
	                X = event.pageX;
	                Y = event.pageY;
	            } else {
	                X = event.clientX;
	                Y = event.clientY;
	            }
	            // rtl handling
	            var isRTL = isRightToLeft();
	            if (isRTL) {
	                // reverse X 
	                X = document.body.offsetWidth - X;
	                // if has a starting left, calculate offsetRight
	                if (!isNaN(startingLeft)) {
	                    offsetLeft = document.body.offsetWidth - offsetLeft - element.offsetWidth;
	                }
	            }

	            // set width/height
	            element.style.height = (Y - offsetTop + handleOffset) + 'px';
	            element.style.width = (X - offsetLeft + handleOffset) + 'px';

	            // if the element being resized has a starting left, maintain it.
	            // the dialog is centered, divide by half the offset to maintain the margins.
	            if (!isNaN(startingLeft)) {
	                var diff = Math.abs(element.offsetWidth - startingWidth) * 0.5;
	                if (isRTL) {
	                    //negate the diff, why?
	                    //when growing it should decrease left
	                    //when shrinking it should increase left
	                    diff *= -1;
	                }
	                if (element.offsetWidth > startingWidth) {
	                    //growing
	                    element.style.left = (startingLeft + diff) + 'px';
	                } else if (element.offsetWidth >= minWidth) {
	                    //shrinking
	                    element.style.left = (startingLeft - diff) + 'px';
	                }
	            }
	        }

	        /**
	         * Triggers the start of a resize event, attached to the resize handle element mouse down event.
	         * Adds no-selection class to the body, disabling selection while moving.
	         *
	         * @param {Event} event	DOM event object.
	         * @param {Object} instance The dilog instance.
	         * 
	         * @return {Boolean} false
	         */
	        function beginResize(event, instance) {
	            if (!instance.isMaximized()) {
	                var eventSrc;
	                if (event.type === 'touchstart') {
	                    event.preventDefault();
	                    eventSrc = event.targetTouches[0];
	                } else if (event.button === 0) {
	                    eventSrc = event;
	                }
	                if (eventSrc) {
	                    // allow custom `onresize` method
	                    dispatchEvent('onresize', instance);
	                    
	                    resizable = instance;
	                    handleOffset = instance.elements.resizeHandle.offsetHeight / 2;
	                    var element = instance.elements.dialog;
	                    addClass(element, classes.capture);
	                    startingLeft = parseInt(element.style.left, 10);
	                    element.style.height = element.offsetHeight + 'px';
	                    element.style.minHeight = instance.elements.header.offsetHeight + instance.elements.footer.offsetHeight + 'px';
	                    element.style.width = (startingWidth = element.offsetWidth) + 'px';

	                    if (element.style.maxWidth !== 'none') {
	                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
	                    }
	                    element.style.maxWidth = 'none';
	                    addClass(document.body, classes.noSelection);
	                    return false;
	                }
	            }
	        }

	        /**
	         * The actual resize handler,  attached to document.body mousemove event.
	         *
	         * @param {Event} event	DOM event object.
	         * 
	         * @return {undefined}
	         */
	        function resize(event) {
	            if (resizable) {
	                var eventSrc;
	                if (event.type === 'touchmove') {
	                    event.preventDefault();
	                    eventSrc = event.targetTouches[0];
	                } else if (event.button === 0) {
	                    eventSrc = event;
	                }
	                if (eventSrc) {
	                    resizeElement(eventSrc, resizable.elements.dialog, !resizable.get('modal') && !resizable.get('pinned'));
	                }
	            }
	        }

	        /**
	         * Triggers the end of a resize event,  attached to document.body mouseup event.
	         * Removes no-selection class from document.body, allowing selection.
	         *
	         * @return {undefined}
	         */
	        function endResize() {
	            if (resizable) {
	                var instance = resizable;
	                resizable = null;
	                removeClass(document.body, classes.noSelection);
	                removeClass(instance.elements.dialog, classes.capture);
	                cancelClick = true;
	                // allow custom `onresized` method
	                dispatchEvent('onresized', instance);
	            }
	        }

	        /**
	         * Resets any changes made by resizing the element to its original state.
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function resetResize(instance) {
	            resizable = null;
	            var element = instance.elements.dialog;
	            if (element.style.maxWidth === 'none') {
	                //clear inline styles.
	                element.style.maxWidth = element.style.minWidth = element.style.width = element.style.height = element.style.minHeight = element.style.left = '';
	                //reset variables.
	                startingLeft = Number.Nan;
	                startingWidth = minWidth = handleOffset = 0;
	            }
	        }


	        /**
	         * Updates the dialog move behavior.
	         *
	         * @param {Object} instance The dilog instance.
	         * @param {Boolean} on True to add the behavior, removes it otherwise.
	         *
	         * @return {undefined}
	         */
	        function updateResizable(instance) {
	            if (instance.get('resizable')) {
	                // add class
	                addClass(instance.elements.root, classes.resizable);
	                if (instance.isOpen()) {
	                    bindResizableEvents(instance);
	                }
	            } else {
	                //reset
	                resetResize(instance);
	                // remove class
	                removeClass(instance.elements.root, classes.resizable);
	                if (instance.isOpen()) {
	                    unbindResizableEvents(instance);
	                }
	            }
	        }

	        /**
	         * Reset move/resize on window resize.
	         *
	         * @param {Event} event	window resize event object.
	         *
	         * @return {undefined}
	         */
	        function windowResize(/*event*/) {
	            for (var x = 0; x < openDialogs.length; x += 1) {
	                var instance = openDialogs[x];
	                if (instance.get('autoReset')) {
	                    resetMove(instance);
	                    resetResize(instance);
	                }
	            }
	        }
	        /**
	         * Bind dialogs events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bindEvents(instance) {
	            // if first dialog, hook global handlers
	            if (openDialogs.length === 1) {
	                //global
	                on(window, 'resize', windowResize);
	                on(document.body, 'keyup', keyupHandler);
	                on(document.body, 'keydown', keydownHandler);
	                on(document.body, 'focus', onReset);

	                //move
	                on(document.documentElement, 'mousemove', move);
	                on(document.documentElement, 'touchmove', move);
	                on(document.documentElement, 'mouseup', endMove);
	                on(document.documentElement, 'touchend', endMove);
	                //resize
	                on(document.documentElement, 'mousemove', resize);
	                on(document.documentElement, 'touchmove', resize);
	                on(document.documentElement, 'mouseup', endResize);
	                on(document.documentElement, 'touchend', endResize);
	            }

	            // common events
	            on(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
	            on(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
	            on(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
	            on(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

	            //prevent handling key up when dialog is being opened by a key stroke.
	            cancelKeyup = true;
	            // hook in transition handler
	            on(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

	            // modelss only events
	            if (!instance.get('modal')) {
	                bindModelessEvents(instance);
	            }

	            // resizable
	            if (instance.get('resizable')) {
	                bindResizableEvents(instance);
	            }

	            // movable
	            if (instance.get('movable')) {
	                bindMovableEvents(instance);
	            }
	        }

	        /**
	         * Unbind dialogs events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function unbindEvents(instance) {
	            // if last dialog, remove global handlers
	            if (openDialogs.length === 1) {
	                //global
	                off(window, 'resize', windowResize);
	                off(document.body, 'keyup', keyupHandler);
	                off(document.body, 'keydown', keydownHandler);
	                off(document.body, 'focus', onReset);
	                //move
	                off(document.documentElement, 'mousemove', move);
	                off(document.documentElement, 'mouseup', endMove);
	                //resize
	                off(document.documentElement, 'mousemove', resize);
	                off(document.documentElement, 'mouseup', endResize);
	            }

	            // common events
	            off(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
	            off(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
	            off(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
	            off(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

	            // hook out transition handler
	            on(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

	            // modelss only events
	            if (!instance.get('modal')) {
	                unbindModelessEvents(instance);
	            }

	            // movable
	            if (instance.get('movable')) {
	                unbindMovableEvents(instance);
	            }

	            // resizable
	            if (instance.get('resizable')) {
	                unbindResizableEvents(instance);
	            }

	        }

	        /**
	         * Bind modeless specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bindModelessEvents(instance) {
	            on(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
	        }

	        /**
	         * Unbind modeless specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function unbindModelessEvents(instance) {
	            off(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
	        }



	        /**
	         * Bind movable specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bindMovableEvents(instance) {
	            on(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
	            on(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
	        }

	        /**
	         * Unbind movable specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function unbindMovableEvents(instance) {
	            off(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
	            off(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
	        }



	        /**
	         * Bind resizable specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bindResizableEvents(instance) {
	            on(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
	            on(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
	        }

	        /**
	         * Unbind resizable specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function unbindResizableEvents(instance) {
	            off(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
	            off(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
	        }

	        /**
	         * Bind closable events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function bindClosableEvents(instance) {
	            on(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
	        }

	        /**
	         * Unbind closable specific events
	         *
	         * @param {Object} instance The dilog instance.
	         *
	         * @return {undefined}
	         */
	        function unbindClosableEvents(instance) {
	            off(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
	        }
	        // dialog API
	        return {
	            __init:initialize,
	            /**
	             * Check if dialog is currently open
	             *
	             * @return {Boolean}
	             */
	            isOpen: function () {
	                return this.__internal.isOpen;
	            },
	            isModal: function (){
	                return this.elements.root.className.indexOf(classes.modeless) < 0;
	            },
	            isMaximized:function(){
	                return this.elements.root.className.indexOf(classes.maximized) > -1;
	            },
	            isPinned:function(){
	                return this.elements.root.className.indexOf(classes.unpinned) < 0;
	            },
	            maximize:function(){
	                if(!this.isMaximized()){
	                    maximize(this);
	                }
	                return this;
	            },
	            restore:function(){
	                if(this.isMaximized()){
	                    restore(this);
	                }
	                return this;
	            },
	            pin:function(){
	                if(!this.isPinned()){
	                    pin(this);
	                }
	                return this;
	            },
	            unpin:function(){
	                if(this.isPinned()){
	                    unpin(this);
	                }
	                return this;
	            },
	            bringToFront:function(){
	                bringToFront(null, this);
	                return this;
	            },
	            /**
	             * Move the dialog to a specific x/y coordinates
	             *
	             * @param {Number} x    The new dialog x coordinate in pixels.
	             * @param {Number} y    The new dialog y coordinate in pixels.
	             *
	             * @return {Object} The dialog instance.
	             */
	            moveTo:function(x,y){
	                if(!isNaN(x) && !isNaN(y)){
	                    // allow custom `onmove` method
	                    dispatchEvent('onmove', this);
	                    
	                    var element = this.elements.dialog,
	                        current = element,
	                        offsetLeft = 0,
	                        offsetTop = 0;
	                    
	                    //subtract existing left,top
	                    if (element.style.left) {
	                        offsetLeft -= parseInt(element.style.left, 10);
	                    }
	                    if (element.style.top) {
	                        offsetTop -= parseInt(element.style.top, 10);
	                    }
	                    //calc offset
	                    do {
	                        offsetLeft += current.offsetLeft;
	                        offsetTop += current.offsetTop;
	                    } while (current = current.offsetParent);

	                    //calc left, top
	                    var left = (x - offsetLeft);
	                    var top  = (y - offsetTop);

	                    //// rtl handling
	                    if (isRightToLeft()) {
	                        left *= -1;
	                    }

	                    element.style.left = left + 'px';
	                    element.style.top = top + 'px';
	                    
	                    // allow custom `onmoved` method
	                    dispatchEvent('onmoved', this);
	                }
	                return this;
	            },
	            /**
	             * Resize the dialog to a specific width/height (the dialog must be 'resizable').
	             * The dialog can be resized to:
	             *  A minimum width equal to the initial display width
	             *  A minimum height equal to the sum of header/footer heights.
	             *
	             *
	             * @param {Number or String} width    The new dialog width in pixels or in percent.
	             * @param {Number or String} height   The new dialog height in pixels or in percent.
	             *
	             * @return {Object} The dialog instance.
	             */
	            resizeTo:function(width,height){
	                var w = parseFloat(width),
	                    h = parseFloat(height),
	                    regex = /(\d*\.\d+|\d+)%/
	                ;

	                if(!isNaN(w) && !isNaN(h) && this.get('resizable') === true){
	                    
	                    // allow custom `onresize` method
	                    dispatchEvent('onresize', this);
	                    
	                    if(('' + width).match(regex)){
	                        w = w / 100 * document.documentElement.clientWidth ;
	                    }

	                    if(('' + height).match(regex)){
	                        h = h / 100 * document.documentElement.clientHeight;
	                    }

	                    var element = this.elements.dialog;
	                    if (element.style.maxWidth !== 'none') {
	                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
	                    }
	                    element.style.maxWidth = 'none';
	                    element.style.minHeight = this.elements.header.offsetHeight + this.elements.footer.offsetHeight + 'px';
	                    element.style.width = w + 'px';
	                    element.style.height = h + 'px';
	                    
	                    // allow custom `onresized` method
	                    dispatchEvent('onresized', this);
	                }
	                return this;
	            },
	            /**
	             * Gets or Sets dialog settings/options 
	             *
	             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
	             * @param {Object} value Optional, the value associated with the key (in case it was a string).
	             *
	             * @return {undefined}
	             */
	            setting : function (key, value) {
	                var self = this;
	                var result = update(this, this.__internal.options, function(k,o,n){ optionUpdated(self,k,o,n); }, key, value);
	                if(result.op === 'get'){
	                    if(result.found){
	                        return result.value;
	                    }else if(typeof this.settings !== 'undefined'){
	                        return update(this, this.settings, this.settingUpdated || function(){}, key, value).value;
	                    }else{
	                        return undefined;
	                    }
	                }else if(result.op === 'set'){
	                    if(result.items.length > 0){
	                        var callback = this.settingUpdated || function(){};
	                        for(var x=0;x<result.items.length;x+=1){
	                            var item = result.items[x];
	                            if(!item.found && typeof this.settings !== 'undefined'){
	                                update(this, this.settings, callback, item.key, item.value);
	                            }
	                        }
	                    }
	                    return this;
	                }
	            },
	            /**
	             * [Alias] Sets dialog settings/options 
	             */
	            set:function(key, value){
	                this.setting(key,value);
	                return this;
	            },
	            /**
	             * [Alias] Gets dialog settings/options 
	             */
	            get:function(key){
	                return this.setting(key);
	            },
	            /**
	            * Sets dialog header
	            * @content {string or element}
	            *
	            * @return {undefined}
	            */
	            setHeader:function(content){
	                if(typeof content === 'string'){
	                    clearContents(this.elements.header);
	                    this.elements.header.innerHTML = content;
	                }else if (content instanceof window.HTMLElement && this.elements.header.firstChild !== content){
	                    clearContents(this.elements.header);
	                    this.elements.header.appendChild(content);
	                }
	                return this;
	            },
	            /**
	            * Sets dialog contents
	            * @content {string or element}
	            *
	            * @return {undefined}
	            */
	            setContent:function(content){
	                if(typeof content === 'string'){
	                    clearContents(this.elements.content);
	                    this.elements.content.innerHTML = content;
	                }else if (content instanceof window.HTMLElement && this.elements.content.firstChild !== content){
	                    clearContents(this.elements.content);
	                    this.elements.content.appendChild(content);
	                }
	                return this;
	            },
	            /**
	             * Show the dialog as modal
	             *
	             * @return {Object} the dialog instance.
	             */
	            showModal: function(className){
	                return this.show(true, className);
	            },
	            /**
	             * Show the dialog
	             *
	             * @return {Object} the dialog instance.
	             */
	            show: function (modal, className) {
	                
	                // ensure initialization
	                initialize(this);

	                if ( !this.__internal.isOpen ) {

	                    // add to open dialogs
	                    this.__internal.isOpen = true;
	                    openDialogs.push(this);

	                    // save last focused element
	                    if(alertify.defaults.maintainFocus){
	                        this.__internal.activeElement = document.activeElement;
	                    }

	                    //allow custom dom manipulation updates before showing the dialog.
	                    if(typeof this.prepare === 'function'){
	                        this.prepare();
	                    }

	                    bindEvents(this);

	                    if(modal !== undefined){
	                        this.set('modal', modal);
	                    }

	                    //save scroll to prevent document jump
	                    saveScrollPosition();

	                    ensureNoOverflow();

	                    // allow custom dialog class on show
	                    if(typeof className === 'string' && className !== ''){
	                        this.__internal.className = className;
	                        addClass(this.elements.root, className);
	                    }

	                    // maximize if start maximized
	                    if ( this.get('startMaximized')) {
	                        this.maximize();
	                    }else if(this.isMaximized()){
	                        restore(this);
	                    }

	                    updateAbsPositionFix(this);

	                    removeClass(this.elements.root, classes.animationOut);
	                    addClass(this.elements.root, classes.animationIn);

	                    // set 1s fallback in case transition event doesn't fire
	                    clearTimeout( this.__internal.timerIn);
	                    this.__internal.timerIn = setTimeout( this.__internal.transitionInHandler, transition.supported ? 1000 : 100 );

	                    if(isSafari){
	                        // force desktop safari reflow
	                        var root = this.elements.root;
	                        root.style.display  = 'none';
	                        setTimeout(function(){root.style.display  = 'block';}, 0);
	                    }

	                    //reflow
	                    reflow = this.elements.root.offsetWidth;
	                  
	                    // show dialog
	                    removeClass(this.elements.root, classes.hidden);

	                    // internal on show event
	                    if(typeof this.hooks.onshow === 'function'){
	                        this.hooks.onshow.call(this);
	                    }

	                    // allow custom `onshow` method
	                    dispatchEvent('onshow', this);

	                }else{
	                    // reset move updates
	                    resetMove(this);
	                    // reset resize updates
	                    resetResize(this);
	                    // shake the dialog to indicate its already open
	                    addClass(this.elements.dialog, classes.shake);
	                    var self = this;
	                    setTimeout(function(){
	                        removeClass(self.elements.dialog, classes.shake);
	                    },200);
	                }
	                return this;
	            },
	            /**
	             * Close the dialog
	             *
	             * @return {Object} The dialog instance
	             */
	            close: function () {
	                if (this.__internal.isOpen ) {

	                    unbindEvents(this);

	                    removeClass(this.elements.root, classes.animationIn);
	                    addClass(this.elements.root, classes.animationOut);

	                    // set 1s fallback in case transition event doesn't fire
	                    clearTimeout( this.__internal.timerOut );
	                    this.__internal.timerOut = setTimeout( this.__internal.transitionOutHandler, transition.supported ? 1000 : 100 );
	                    // hide dialog
	                    addClass(this.elements.root, classes.hidden);
	                    //reflow
	                    reflow = this.elements.modal.offsetWidth;

	                    // remove custom dialog class on hide
	                    if (typeof this.__internal.className !== 'undefined' && this.__internal.className !== '') {
	                        removeClass(this.elements.root, this.__internal.className);
	                    }

	                    // internal on close event
	                    if(typeof this.hooks.onclose === 'function'){
	                        this.hooks.onclose.call(this);
	                    }

	                    // allow custom `onclose` method
	                    dispatchEvent('onclose', this);

	                    //remove from open dialogs
	                    openDialogs.splice(openDialogs.indexOf(this),1);
	                    this.__internal.isOpen = false;

	                    ensureNoOverflow();

	                }
	                return this;
	            },
	            /**
	             * Close all open dialogs except this.
	             *
	             * @return {undefined}
	             */
	            closeOthers:function(){
	                alertify.closeAll(this);
	                return this;
	            },
	            /**
	             * Destroys this dialog instance
	             *
	             * @return {undefined}
	             */
	            destroy:function(){
	                if (this.__internal.isOpen ) {
	                    //mark dialog for destruction, this will be called on tranistionOut event.
	                    this.__internal.destroy = function(){
	                        destruct(this, initialize);
	                    };
	                    //close the dialog to unbind all events.
	                    this.close();
	                }else{
	                    destruct(this, initialize);
	                }
	                return this;
	            },
	        };
		} () );
	    var notifier = (function () {
	        var reflow,
	            element,
	            openInstances = [],
	            classes = {
	                base: 'alertify-notifier',
	                message: 'ajs-message',
	                top: 'ajs-top',
	                right: 'ajs-right',
	                bottom: 'ajs-bottom',
	                left: 'ajs-left',
	                visible: 'ajs-visible',
	                hidden: 'ajs-hidden'
	            };
	        /**
	         * Helper: initializes the notifier instance
	         * 
	         */
	        function initialize(instance) {

	            if (!instance.__internal) {
	                instance.__internal = {
	                    position: alertify.defaults.notifier.position,
	                    delay: alertify.defaults.notifier.delay,
	                };

	                element = document.createElement('DIV');

	                updatePosition(instance);
	            }

	            //add to DOM tree.
	            if (element.parentNode !== document.body) {
	                document.body.appendChild(element);
	            }
	        }
	        
	        function pushInstance(instance) {
	            instance.__internal.pushed = true;
	            openInstances.push(instance);
	        }
	        function popInstance(instance) {
	            openInstances.splice(openInstances.indexOf(instance), 1);
	            instance.__internal.pushed = false;
	        }
	        /**
	         * Helper: update the notifier instance position
	         * 
	         */
	        function updatePosition(instance) {
	            element.className = classes.base;
	            switch (instance.__internal.position) {
	            case 'top-right':
	                addClass(element, classes.top + ' ' + classes.right);
	                break;
	            case 'top-left':
	                addClass(element, classes.top + ' ' + classes.left);
	                break;
	            case 'bottom-left':
	                addClass(element, classes.bottom + ' ' + classes.left);
	                break;

	            default:
	            case 'bottom-right':
	                addClass(element, classes.bottom + ' ' + classes.right);
	                break;
	            }
	        }

	        /**
	        * creates a new notification message
	        *
	        * @param  {DOMElement} message	The notifier message element
	        * @param  {Number} wait   Time (in ms) to wait before the message is dismissed, a value of 0 means keep open till clicked.
	        * @param  {Function} callback A callback function to be invoked when the message is dismissed.
	        *
	        * @return {undefined}
	        */
	        function create(div, callback) {

	            function clickDelegate(event, instance) {
	                instance.dismiss(true);
	            }

	            function transitionDone(event, instance) {
	                // unbind event
	                off(instance.element, transition.type, transitionDone);
	                // remove the message
	                element.removeChild(instance.element);
	            }

	            function initialize(instance) {
	                if (!instance.__internal) {
	                    instance.__internal = {
	                        pushed: false,
	                        delay : undefined,
	                        timer: undefined,
	                        clickHandler: undefined,
	                        transitionEndHandler: undefined,
	                        transitionTimeout: undefined
	                    };
	                    instance.__internal.clickHandler = delegate(instance, clickDelegate);
	                    instance.__internal.transitionEndHandler = delegate(instance, transitionDone);
	                }
	                return instance;
	            }
	            function clearTimers(instance) {
	                clearTimeout(instance.__internal.timer);
	                clearTimeout(instance.__internal.transitionTimeout);
	            }
	            return initialize({
	                /* notification DOM element*/
	                element: div,
	                /*
	                 * Pushes a notification message 
	                 * @param {string or DOMElement} content The notification message content
	                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
	                 * 
	                 */
	                push: function (_content, _wait) {
	                    if (!this.__internal.pushed) {

	                        pushInstance(this);
	                        clearTimers(this);

	                        var content, wait;
	                        switch (arguments.length) {
	                        case 0:
	                            wait = this.__internal.delay;
	                            break;
	                        case 1:
	                            if (typeof (_content) === 'number') {
	                                wait = _content;
	                            } else {
	                                content = _content;
	                                wait = this.__internal.delay;
	                            }
	                            break;
	                        case 2:
	                            content = _content;
	                            wait = _wait;
	                            break;
	                        }
	                        // set contents
	                        if (typeof content !== 'undefined') {
	                            this.setContent(content);
	                        }
	                        // append or insert
	                        if (notifier.__internal.position.indexOf('top') < 0) {
	                            element.appendChild(this.element);
	                        } else {
	                            element.insertBefore(this.element, element.firstChild);
	                        }
	                        reflow = this.element.offsetWidth;
	                        addClass(this.element, classes.visible);
	                        // attach click event
	                        on(this.element, 'click', this.__internal.clickHandler);
	                        return this.delay(wait);
	                    }
	                    return this;
	                },
	                /*
	                 * {Function} callback function to be invoked before dismissing the notification message.
	                 * Remarks: A return value === 'false' will cancel the dismissal
	                 * 
	                 */
	                ondismiss: function () { },
	                /*
	                 * {Function} callback function to be invoked when the message is dismissed.
	                 * 
	                 */
	                callback: callback,
	                /*
	                 * Dismisses the notification message 
	                 * @param {Boolean} clicked A flag indicating if the dismissal was caused by a click.
	                 * 
	                 */
	                dismiss: function (clicked) {
	                    if (this.__internal.pushed) {
	                        clearTimers(this);
	                        if (!(typeof this.ondismiss === 'function' && this.ondismiss.call(this) === false)) {
	                            //detach click event
	                            off(this.element, 'click', this.__internal.clickHandler);
	                            // ensure element exists
	                            if (typeof this.element !== 'undefined' && this.element.parentNode === element) {
	                                //transition end or fallback
	                                this.__internal.transitionTimeout = setTimeout(this.__internal.transitionEndHandler, transition.supported ? 1000 : 100);
	                                removeClass(this.element, classes.visible);

	                                // custom callback on dismiss
	                                if (typeof this.callback === 'function') {
	                                    this.callback.call(this, clicked);
	                                }
	                            }
	                            popInstance(this);
	                        }
	                    }
	                    return this;
	                },
	                /*
	                 * Delays the notification message dismissal
	                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
	                 * 
	                 */
	                delay: function (wait) {
	                    clearTimers(this);
	                    this.__internal.delay = typeof wait !== 'undefined' && !isNaN(+wait) ? +wait : notifier.__internal.delay;
	                    if (this.__internal.delay > 0) {
	                        var  self = this;
	                        this.__internal.timer = setTimeout(function () { self.dismiss(); }, this.__internal.delay * 1000);
	                    }
	                    return this;
	                },
	                /*
	                 * Sets the notification message contents
	                 * @param {string or DOMElement} content The notification message content
	                 * 
	                 */
	                setContent: function (content) {
	                    if (typeof content === 'string') {
	                        clearContents(this.element);
	                        this.element.innerHTML = content;
	                    } else if (content instanceof window.HTMLElement && this.element.firstChild !== content) {
	                        clearContents(this.element);
	                        this.element.appendChild(content);
	                    }
	                    return this;
	                },
	                /*
	                 * Dismisses all open notifications except this.
	                 * 
	                 */
	                dismissOthers: function () {
	                    notifier.dismissAll(this);
	                    return this;
	                }
	            });
	        }

	        //notifier api
	        return {
	            /**
	             * Gets or Sets notifier settings. 
	             *
	             * @param {string} key The setting name
	             * @param {Variant} value The setting value.
	             *
	             * @return {Object}	if the called as a setter, return the notifier instance.
	             */
	            setting: function (key, value) {
	                //ensure init
	                initialize(this);

	                if (typeof value === 'undefined') {
	                    //get
	                    return this.__internal[key];
	                } else {
	                    //set
	                    switch (key) {
	                    case 'position':
	                        this.__internal.position = value;
	                        updatePosition(this);
	                        break;
	                    case 'delay':
	                        this.__internal.delay = value;
	                        break;
	                    }
	                }
	                return this;
	            },
	            /**
	             * [Alias] Sets dialog settings/options 
	             */
	            set:function(key,value){
	                this.setting(key,value);
	                return this;
	            },
	            /**
	             * [Alias] Gets dialog settings/options 
	             */
	            get:function(key){
	                return this.setting(key);
	            },
	            /**
	             * Creates a new notification message
	             *
	             * @param {string} type The type of notification message (simply a CSS class name 'ajs-{type}' to be added).
	             * @param {Function} callback  A callback function to be invoked when the message is dismissed.
	             *
	             * @return {undefined}
	             */
	            create: function (type, callback) {
	                //ensure notifier init
	                initialize(this);
	                //create new notification message
	                var div = document.createElement('div');
	                div.className = classes.message + ((typeof type === 'string' && type !== '') ? ' ajs-' + type : '');
	                return create(div, callback);
	            },
	            /**
	             * Dismisses all open notifications.
	             *
	             * @param {Object} excpet [optional] The notification object to exclude from dismissal.
	             *
	             */
	            dismissAll: function (except) {
	                var clone = openInstances.slice(0);
	                for (var x = 0; x < clone.length; x += 1) {
	                    var  instance = clone[x];
	                    if (except === undefined || except !== instance) {
	                        instance.dismiss();
	                    }
	                }
	            }
	        };
	    })();
	    /**
	     * Alertify public API
	     * This contains everything that is exposed through the alertify object.
	     *
	     * @return {Object}
	     */
	    function Alertify() {

	        // holds a references of created dialogs
	        var dialogs = {};

	        /**
	         * Extends a given prototype by merging properties from base into sub.
	         *
	         * @sub {Object} sub The prototype being overwritten.
	         * @base {Object} base The prototype being written.
	         *
	         * @return {Object} The extended prototype.
	         */
	        function extend(sub, base) {
	            // copy dialog pototype over definition.
	            for (var prop in base) {
	                if (base.hasOwnProperty(prop)) {
	                    sub[prop] = base[prop];
	                }
	            }
	            return sub;
	        }


	        /**
	        * Helper: returns a dialog instance from saved dialogs.
	        * and initializes the dialog if its not already initialized.
	        *
	        * @name {String} name The dialog name.
	        *
	        * @return {Object} The dialog instance.
	        */
	        function get_dialog(name) {
	            var dialog = dialogs[name].dialog;
	            //initialize the dialog if its not already initialized.
	            if (dialog && typeof dialog.__init === 'function') {
	                dialog.__init(dialog);
	            }
	            return dialog;
	        }

	        /**
	         * Helper:  registers a new dialog definition.
	         *
	         * @name {String} name The dialog name.
	         * @Factory {Function} Factory a function resposible for creating dialog prototype.
	         * @transient {Boolean} transient True to create a new dialog instance each time the dialog is invoked, false otherwise.
	         * @base {String} base the name of another dialog to inherit from.
	         *
	         * @return {Object} The dialog definition.
	         */
	        function register(name, Factory, transient, base) {
	            var definition = {
	                dialog: null,
	                factory: Factory
	            };

	            //if this is based on an existing dialog, create a new definition
	            //by applying the new protoype over the existing one.
	            if (base !== undefined) {
	                definition.factory = function () {
	                    return extend(new dialogs[base].factory(), new Factory());
	                };
	            }

	            if (!transient) {
	                //create a new definition based on dialog
	                definition.dialog = extend(new definition.factory(), dialog);
	            }
	            return dialogs[name] = definition;
	        }

	        return {
	            /**
	             * Alertify defaults
	             * 
	             * @type {Object}
	             */
	            defaults: defaults,
	            /**
	             * Dialogs factory 
	             *
	             * @param {string}      Dialog name.
	             * @param {Function}    A Dialog factory function.
	             * @param {Boolean}     Indicates whether to create a singleton or transient dialog.
	             * @param {String}      The name of the base type to inherit from.
	             */
	            dialog: function (name, Factory, transient, base) {

	                // get request, create a new instance and return it.
	                if (typeof Factory !== 'function') {
	                    return get_dialog(name);
	                }

	                if (this.hasOwnProperty(name)) {
	                    throw new Error('alertify.dialog: name already exists');
	                }

	                // register the dialog
	                var definition = register(name, Factory, transient, base);

	                if (transient) {

	                    // make it public
	                    this[name] = function () {
	                        //if passed with no params, consider it a get request
	                        if (arguments.length === 0) {
	                            return definition.dialog;
	                        } else {
	                            var instance = extend(new definition.factory(), dialog);
	                            //ensure init
	                            if (instance && typeof instance.__init === 'function') {
	                                instance.__init(instance);
	                            }
	                            instance['main'].apply(instance, arguments);
	                            return instance['show'].apply(instance);
	                        }
	                    };
	                } else {
	                    // make it public
	                    this[name] = function () {
	                        //ensure init
	                        if (definition.dialog && typeof definition.dialog.__init === 'function') {
	                            definition.dialog.__init(definition.dialog);
	                        }
	                        //if passed with no params, consider it a get request
	                        if (arguments.length === 0) {
	                            return definition.dialog;
	                        } else {
	                            var dialog = definition.dialog;
	                            dialog['main'].apply(definition.dialog, arguments);
	                            return dialog['show'].apply(definition.dialog);
	                        }
	                    };
	                }
	            },
	            /**
	             * Close all open dialogs.
	             *
	             * @param {Object} excpet [optional] The dialog object to exclude from closing.
	             *
	             * @return {undefined}
	             */
	            closeAll: function (except) {
	                var clone = openDialogs.slice(0);
	                for (var x = 0; x < clone.length; x += 1) {
	                    var instance = clone[x];
	                    if (except === undefined || except !== instance) {
	                        instance.close();
	                    }
	                }
	            },
	            /**
	             * Gets or Sets dialog settings/options. if the dialog is transient, this call does nothing.
	             *
	             * @param {string} name The dialog name.
	             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
	             * @param {Variant} value Optional, the value associated with the key (in case it was a string).
	             *
	             * @return {undefined}
	             */
	            setting: function (name, key, value) {

	                if (name === 'notifier') {
	                    return notifier.setting(key, value);
	                }

	                var dialog = get_dialog(name);
	                if (dialog) {
	                    return dialog.setting(key, value);
	                }
	            },
	            /**
	             * [Alias] Sets dialog settings/options 
	             */
	            set: function(name,key,value){
	                return this.setting(name, key,value);
	            },
	            /**
	             * [Alias] Gets dialog settings/options 
	             */
	            get: function(name, key){
	                return this.setting(name, key);
	            },
	            /**
	             * Creates a new notification message.
	             * If a type is passed, a class name "ajs-{type}" will be added.
	             * This allows for custom look and feel for various types of notifications.
	             *
	             * @param  {String | DOMElement}    [message=undefined]		Message text
	             * @param  {String}                 [type='']				Type of log message
	             * @param  {String}                 [wait='']				Time (in seconds) to wait before auto-close
	             * @param  {Function}               [callback=undefined]	A callback function to be invoked when the log is closed.
	             *
	             * @return {Object} Notification object.
	             */
	            notify: function (message, type, wait, callback) {
	                return notifier.create(type, callback).push(message, wait);
	            },
	            /**
	             * Creates a new notification message.
	             *
	             * @param  {String}		[message=undefined]		Message text
	             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
	             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
	             *
	             * @return {Object} Notification object.
	             */
	            message: function (message, wait, callback) {
	                return notifier.create(null, callback).push(message, wait);
	            },
	            /**
	             * Creates a new notification message of type 'success'.
	             *
	             * @param  {String}		[message=undefined]		Message text
	             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
	             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
	             *
	             * @return {Object} Notification object.
	             */
	            success: function (message, wait, callback) {
	                return notifier.create('success', callback).push(message, wait);
	            },
	            /**
	             * Creates a new notification message of type 'error'.
	             *
	             * @param  {String}		[message=undefined]		Message text
	             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
	             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
	             *
	             * @return {Object} Notification object.
	             */
	            error: function (message, wait, callback) {
	                return notifier.create('error', callback).push(message, wait);
	            },
	            /**
	             * Creates a new notification message of type 'warning'.
	             *
	             * @param  {String}		[message=undefined]		Message text
	             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
	             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
	             *
	             * @return {Object} Notification object.
	             */
	            warning: function (message, wait, callback) {
	                return notifier.create('warning', callback).push(message, wait);
	            },
	            /**
	             * Dismisses all open notifications
	             *
	             * @return {undefined}
	             */
	            dismissAll: function () {
	                notifier.dismissAll();
	            }
	        };
	    }
	    var alertify = new Alertify();

	    /**
	    * Alert dialog definition
	    *
	    * invoked by:
	    *	alertify.alert(message);
	    *	alertify.alert(title, message);
	    *	alertify.alert(message, onok);
	    *	alertify.alert(title, message, onok);
	     */
	    alertify.dialog('alert', function () {
	        return {
	            main: function (_title, _message, _onok) {
	                var title, message, onok;
	                switch (arguments.length) {
	                case 1:
	                    message = _title;
	                    break;
	                case 2:
	                    if (typeof _message === 'function') {
	                        message = _title;
	                        onok = _message;
	                    } else {
	                        title = _title;
	                        message = _message;
	                    }
	                    break;
	                case 3:
	                    title = _title;
	                    message = _message;
	                    onok = _onok;
	                    break;
	                }
	                this.set('title', title);
	                this.set('message', message);
	                this.set('onok', onok);
	                return this;
	            },
	            setup: function () {
	                return {
	                    buttons: [
	                        {
	                            text: alertify.defaults.glossary.ok,
	                            key: keys.ESC,
	                            invokeOnClose: true,
	                            className: alertify.defaults.theme.ok,
	                        }
	                    ],
	                    focus: {
	                        element: 0,
	                        select: false
	                    },
	                    options: {
	                        maximizable: false,
	                        resizable: false
	                    }
	                };
	            },
	            build: function () {
	                // nothing
	            },
	            prepare: function () {
	                //nothing
	            },
	            setMessage: function (message) {
	                this.setContent(message);
	            },
	            settings: {
	                message: undefined,
	                onok: undefined,
	                label: undefined,
	            },
	            settingUpdated: function (key, oldValue, newValue) {
	                switch (key) {
	                case 'message':
	                    this.setMessage(newValue);
	                    break;
	                case 'label':
	                    if (this.__internal.buttons[0].element) {
	                        this.__internal.buttons[0].element.innerHTML = newValue;
	                    }
	                    break;
	                }
	            },
	            callback: function (closeEvent) {
	                if (typeof this.get('onok') === 'function') {
	                    var returnValue = this.get('onok').call(this, closeEvent);
	                    if (typeof returnValue !== 'undefined') {
	                        closeEvent.cancel = !returnValue;
	                    }
	                }
	            }
	        };
	    });
	    /**
	     * Confirm dialog object
	     *
	     *	alertify.confirm(message);
	     *	alertify.confirm(message, onok);
	     *	alertify.confirm(message, onok, oncancel);
	     *	alertify.confirm(title, message, onok, oncancel);
	     */
	    alertify.dialog('confirm', function () {

	        var autoConfirm = {
	            timer: null,
	            index: null,
	            text: null,
	            duration: null,
	            task: function (event, self) {
	                if (self.isOpen()) {
	                    self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text + ' (&#8207;' + autoConfirm.duration + '&#8207;) ';
	                    autoConfirm.duration -= 1;
	                    if (autoConfirm.duration === -1) {
	                        clearAutoConfirm(self);
	                        var button = self.__internal.buttons[autoConfirm.index];
	                        var closeEvent = createCloseEvent(autoConfirm.index, button);

	                        if (typeof self.callback === 'function') {
	                            self.callback.apply(self, [closeEvent]);
	                        }
	                        //close the dialog.
	                        if (closeEvent.close !== false) {
	                            self.close();
	                        }
	                    }
	                } else {
	                    clearAutoConfirm(self);
	                }
	            }
	        };

	        function clearAutoConfirm(self) {
	            if (autoConfirm.timer !== null) {
	                clearInterval(autoConfirm.timer);
	                autoConfirm.timer = null;
	                self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text;
	            }
	        }

	        function startAutoConfirm(self, index, duration) {
	            clearAutoConfirm(self);
	            autoConfirm.duration = duration;
	            autoConfirm.index = index;
	            autoConfirm.text = self.__internal.buttons[index].element.innerHTML;
	            autoConfirm.timer = setInterval(delegate(self, autoConfirm.task), 1000);
	            autoConfirm.task(null, self);
	        }


	        return {
	            main: function (_title, _message, _onok, _oncancel) {
	                var title, message, onok, oncancel;
	                switch (arguments.length) {
	                case 1:
	                    message = _title;
	                    break;
	                case 2:
	                    message = _title;
	                    onok = _message;
	                    break;
	                case 3:
	                    message = _title;
	                    onok = _message;
	                    oncancel = _onok;
	                    break;
	                case 4:
	                    title = _title;
	                    message = _message;
	                    onok = _onok;
	                    oncancel = _oncancel;
	                    break;
	                }
	                this.set('title', title);
	                this.set('message', message);
	                this.set('onok', onok);
	                this.set('oncancel', oncancel);
	                return this;
	            },
	            setup: function () {
	                return {
	                    buttons: [
	                        {
	                            text: alertify.defaults.glossary.ok,
	                            key: keys.ENTER,
	                            className: alertify.defaults.theme.ok,
	                        },
	                        {
	                            text: alertify.defaults.glossary.cancel,
	                            key: keys.ESC,
	                            invokeOnClose: true,
	                            className: alertify.defaults.theme.cancel,
	                        }
	                    ],
	                    focus: {
	                        element: 0,
	                        select: false
	                    },
	                    options: {
	                        maximizable: false,
	                        resizable: false
	                    }
	                };
	            },
	            build: function () {
	                //nothing
	            },
	            prepare: function () {
	                //nothing
	            },
	            setMessage: function (message) {
	                this.setContent(message);
	            },
	            settings: {
	                message: null,
	                labels: null,
	                onok: null,
	                oncancel: null,
	                defaultFocus: null,
	                reverseButtons: null,
	            },
	            settingUpdated: function (key, oldValue, newValue) {
	                switch (key) {
	                case 'message':
	                    this.setMessage(newValue);
	                    break;
	                case 'labels':
	                    if ('ok' in newValue && this.__internal.buttons[0].element) {
	                        this.__internal.buttons[0].text = newValue.ok;
	                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
	                    }
	                    if ('cancel' in newValue && this.__internal.buttons[1].element) {
	                        this.__internal.buttons[1].text = newValue.cancel;
	                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
	                    }
	                    break;
	                case 'reverseButtons':
	                    if (newValue === true) {
	                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
	                    } else {
	                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
	                    }
	                    break;
	                case 'defaultFocus':
	                    this.__internal.focus.element = newValue === 'ok' ? 0 : 1;
	                    break;
	                }
	            },
	            callback: function (closeEvent) {
	                clearAutoConfirm(this);
	                var returnValue;
	                switch (closeEvent.index) {
	                case 0:
	                    if (typeof this.get('onok') === 'function') {
	                        returnValue = this.get('onok').call(this, closeEvent);
	                        if (typeof returnValue !== 'undefined') {
	                            closeEvent.cancel = !returnValue;
	                        }
	                    }
	                    break;
	                case 1:
	                    if (typeof this.get('oncancel') === 'function') {
	                        returnValue = this.get('oncancel').call(this, closeEvent);
	                        if (typeof returnValue !== 'undefined') {
	                            closeEvent.cancel = !returnValue;
	                        }
	                    }
	                    break;
	                }
	            },
	            autoOk: function (duration) {
	                startAutoConfirm(this, 0, duration);
	                return this;
	            },
	            autoCancel: function (duration) {
	                startAutoConfirm(this, 1, duration);
	                return this;
	            }
	        };
	    });
	    /**
	     * Prompt dialog object
	     *
	     * invoked by:
	     *	alertify.prompt(message);
	     *	alertify.prompt(message, value);
	     *	alertify.prompt(message, value, onok);
	     *	alertify.prompt(message, value, onok, oncancel);
	     *	alertify.prompt(title, message, value, onok, oncancel);
	     */
	    alertify.dialog('prompt', function () {
	        var input = document.createElement('INPUT');
	        var p = document.createElement('P');
	        return {
	            main: function (_title, _message, _value, _onok, _oncancel) {
	                var title, message, value, onok, oncancel;
	                switch (arguments.length) {
	                case 1:
	                    message = _title;
	                    break;
	                case 2:
	                    message = _title;
	                    value = _message;
	                    break;
	                case 3:
	                    message = _title;
	                    value = _message;
	                    onok = _value;
	                    break;
	                case 4:
	                    message = _title;
	                    value = _message;
	                    onok = _value;
	                    oncancel = _onok;
	                    break;
	                case 5:
	                    title = _title;
	                    message = _message;
	                    value = _value;
	                    onok = _onok;
	                    oncancel = _oncancel;
	                    break;
	                }
	                this.set('title', title);
	                this.set('message', message);
	                this.set('value', value);
	                this.set('onok', onok);
	                this.set('oncancel', oncancel);
	                return this;
	            },
	            setup: function () {
	                return {
	                    buttons: [
	                        {
	                            text: alertify.defaults.glossary.ok,
	                            key: keys.ENTER,
	                            className: alertify.defaults.theme.ok,
	                        },
	                        {
	                            text: alertify.defaults.glossary.cancel,
	                            key: keys.ESC,
	                            invokeOnClose: true,
	                            className: alertify.defaults.theme.cancel,
	                        }
	                    ],
	                    focus: {
	                        element: input,
	                        select: true
	                    },
	                    options: {
	                        maximizable: false,
	                        resizable: false
	                    }
	                };
	            },
	            build: function () {
	                input.className = alertify.defaults.theme.input;
	                input.setAttribute('type', 'text');
	                input.value = this.get('value');
	                this.elements.content.appendChild(p);
	                this.elements.content.appendChild(input);
	            },
	            prepare: function () {
	                //nothing
	            },
	            setMessage: function (message) {
	                if (typeof message === 'string') {
	                    clearContents(p);
	                    p.innerHTML = message;
	                } else if (message instanceof window.HTMLElement && p.firstChild !== message) {
	                    clearContents(p);
	                    p.appendChild(message);
	                }
	            },
	            settings: {
	                message: undefined,
	                labels: undefined,
	                onok: undefined,
	                oncancel: undefined,
	                value: '',
	                type:'text',
	                reverseButtons: undefined,
	            },
	            settingUpdated: function (key, oldValue, newValue) {
	                switch (key) {
	                case 'message':
	                    this.setMessage(newValue);
	                    break;
	                case 'value':
	                    input.value = newValue;
	                    break;
	                case 'type':
	                    switch (newValue) {
	                    case 'text':
	                    case 'color':
	                    case 'date':
	                    case 'datetime-local':
	                    case 'email':
	                    case 'month':
	                    case 'number':
	                    case 'password':
	                    case 'search':
	                    case 'tel':
	                    case 'time':
	                    case 'week':
	                        input.type = newValue;
	                        break;
	                    default:
	                        input.type = 'text';
	                        break;
	                    }
	                    break;
	                case 'labels':
	                    if (newValue.ok && this.__internal.buttons[0].element) {
	                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
	                    }
	                    if (newValue.cancel && this.__internal.buttons[1].element) {
	                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
	                    }
	                    break;
	                case 'reverseButtons':
	                    if (newValue === true) {
	                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
	                    } else {
	                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
	                    }
	                    break;
	                }
	            },
	            callback: function (closeEvent) {
	                var returnValue;
	                switch (closeEvent.index) {
	                case 0:
	                    this.settings.value = input.value;
	                    if (typeof this.get('onok') === 'function') {
	                        returnValue = this.get('onok').call(this, closeEvent, this.settings.value);
	                        if (typeof returnValue !== 'undefined') {
	                            closeEvent.cancel = !returnValue;
	                        }
	                    }
	                    break;
	                case 1:
	                    if (typeof this.get('oncancel') === 'function') {
	                        returnValue = this.get('oncancel').call(this, closeEvent);
	                        if (typeof returnValue !== 'undefined') {
	                            closeEvent.cancel = !returnValue;
	                        }
	                    }
	                    if(!closeEvent.cancel){
	                        input.value = this.settings.value;
	                    }
	                    break;
	                }
	            }
	        };
	    });

	    // CommonJS
	    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
	        module.exports = alertify;
	    // AMD
	    } else if ( true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return alertify;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    // window
	    } else if ( !window.alertify ) {
	        window.alertify = alertify;
	    }

	} ( typeof window !== 'undefined' ? window : this ) );


/***/ }
/******/ ]);