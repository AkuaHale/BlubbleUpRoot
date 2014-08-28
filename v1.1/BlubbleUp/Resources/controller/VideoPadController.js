exports.VideoPadController = function(blubble) {
  var videoPadController = {Name:'Videos',
  Image:'images/movies.png'};

	videoPadController.getWindow = function(){
		return require("ui/VideoPad/VideoPadWindow").VideoPadWindow(videoPadController);
	};

  return videoPadController;
};