var animation  = {
  init: function (loader) {
    this.in_animation = false;
    this.$loader = loader;
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
		this.in_animation = false;
		$(this.$loader).addClass("active")
	},
	renderRemoveComponent: function (component) {
		this.removeAnimationClass(component)
		$(component).addClass("animated fadeOut")
		this.in_animation = true;
		setTimeout(this.removeComponent.bind(this), 800, component)
	},
	renderAddComponent: function (component) {
		if (this.in_animation) {
			setTimeout(this.renderAddComponent.bind(this), 10, component)
		} else {
			this.addComponent(component)
		}
	},
	addComponent: function (component) {
		$(this.$loader).removeClass("active")
		$(component).css("display","")
		$(component).addClass("animated fadeIn")
	}
}
module.exports.animation = animation
