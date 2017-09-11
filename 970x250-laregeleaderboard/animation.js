
function Animation() {
	//time variables
	this.tl = new TimelineLite({
		onComplete : this.reachedEnd.bind(this)
	});

	this.tl.pause();

	this.transitionTime = 0.7;
	this.holdTime = 2;
	this.endFrameTime = 2.2;
	this.endTimeAdjustment = 0.3;

	this.numberOfTimesPlayed = 0;
	this.numberOfTimesToPlay = 1;
	// var runTime = 0;
	// var animationCycle = 30 / numberOfTimesToPlay;

	this.frame = document.querySelector('.banner_size');
	this.frameWidth = this.frame.clientWidth;
	this.frameHeight = this.frame.clientHeight;


	this.time = 0;
}

Animation.prototype.setup = function () {
var self = this;
	self.tl.addLabel("loop start", self.time);
	self.tl.addLabel("start", self.time);

	self.fadeIn('#text1');
	self.time += self.transitionTime + self.holdTime;
	self.fadeOut('#text1');
	self.fadeIn('#text2');
	self.time += self.transitionTime + self.holdTime;
	self.fadeOut('#text2');
	self.fadeIn('#text3');
	self.time += self.transitionTime + self.holdTime;
	self.tl.to('#logo img' , self.transitionTime, {ease: Power2.easeIn, opacity : 1}, self.time);
	self.fadeOut('#text3');
	self.fadeIn('#text4');
	self.time += self.transitionTime;

	self.tl.addLabel("end point", self.time);
	self.tl.addLabel("choose", self.time);

	document.querySelector('.btn2').addEventListener('click', function(){
		self.fadeOut('#text4');
		self.fadeIn('#text5');
		self.tl.play('choose');
		self.time += self.transitionTime;
		self.tl.addLabel("end point", self.time);
	});
};

Animation.prototype.fadeIn = function(node) {
	var parent = document.querySelector(node);
	var children = parent.childNodes;
	var self = this;
	Array.prototype.forEach.call(children, function(item){
		if (item.nodeType == 1) {
			self.tl.to(item , self.transitionTime, {ease: Power2.easeIn, opacity : 1}, self.time);
			self.time += self.transitionTime*0.7;
		}
	});
};

Animation.prototype.fadeOut = function(node) {
	var parent = document.querySelector(node);
	var children = parent.childNodes;
	var self = this;
	Array.prototype.forEach.call(children, function(item){
		if (item.nodeType == 1) {
			self.tl.to(item , self.transitionTime, {ease: Power2.easeOut, opacity : 0}, self.time);
			self.time += self.transitionTime*0.2;
		}
	});
};

Animation.prototype.start = function () {
	this.tl.play('start');
	console.log('length:'+this.tl.duration());
	this.numberOfTimesPlayed++;
};

Animation.prototype.stopAnimation = function () {
	if (this.numberOfTimesPlayed == this.numberOfTimesToPlay) {
		console.log("end point should pause");
		this.tl.pause("end point");
	}
};
Animation.prototype.reachedEnd = function () {
	if (this.numberOfTimesPlayed < this.numberOfTimesToPlay) {
		this.tl.play("loop start");
		this.numberOfTimesPlayed++;
	}else{
		this.stopAnimation();
	}
};
