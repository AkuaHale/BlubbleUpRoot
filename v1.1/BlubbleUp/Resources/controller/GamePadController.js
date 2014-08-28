exports.GamePadController = function(blubble) {
  var gamePadController = {Name:'Games',
  Image:'images/games.png'};

	gamePadController.getWindow = function(){
		return require("ui/GamePad/GamePadWindow").GamePadWindow(gamePadController);
	};

  return gamePadController;
};