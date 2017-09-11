//Initialize Enabler
if (Enabler.isInitialized()) {
	init();
} else {
	Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
}
//Run when Enabler is ready
function init() {
	if (Enabler.isPageLoaded()) {
		politeInit();
	} else {
		Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit);
	}
}

function politeInit() {
	var otherScripts = ['core.css', 'feed.js', 'animation.js'];
	var baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/'
	helper.loadScripts([baseUrl + 'TweenLite.min.js', 
						baseUrl + 'plugins/CSSPlugin.min.js', 
						baseUrl + 'TimelineLite.min.js',
						baseUrl + 'easing/EasePack.min.js'], 
						engineLoaded);

	function engineLoaded(success) {
		if (success) {
			loadOtherScripts();
		}
	}

	function loadOtherScripts() {
		if (window.TweenLite && window.CSSPlugin) {
			if (false){
				//removed banner engine
			}
			helper.loadScripts(otherScripts, loadedScript);
		} else {
		// start a timeout to check for the assets to be loaded
			setTimeout(loadOtherScripts, 200);
		}
	}

	function loadedScript(success) {
		if (success) {
			if (Enabler.isVisible()) {
				console.log("Ready to load feed: " + Enabler.isVisible());
				loadFeed();
			} else {
				Enabler.addEventListener(studio.events.StudioEvent.VISIBLE,
				loadFeed);
			}
		}
	}
}
