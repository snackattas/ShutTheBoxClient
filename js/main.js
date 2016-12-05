var initWebsite = require("expose-loader?initWebsite!./username.js");
initWebsite.initWebsite()
$(document).ready( function () {
  var button = $("#about_button")
  var semantic_modal = $(".ui.modal")
  $(button).on("click", function() {
    $(semantic_modal).modal('show')
  })
})
