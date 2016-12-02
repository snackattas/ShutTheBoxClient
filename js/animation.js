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
