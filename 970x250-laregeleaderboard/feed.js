var clickTag;
var bgExit;

loadFeed = function() {
	startBanner();
};

addClickTagListener = function() {
	bgExit.addEventListener('click', bgExitHandler, false);
}

bgExitHandler = function(e) {
	Enabler.exit('clickTag');
}

startBanner = function() {
	//var duration = 0;
	document.getElementById("container_dc").style.opacity = 1;
	document.getElementById("loading_image_dc").style.opacity = 0;
	document.getElementById('container_dc').style.display = "block";
	bgExit = document.getElementById('clickTag');
	addClickTagListener();
	var animation = new Animation();
	animation.setup();
	animation.start();
}