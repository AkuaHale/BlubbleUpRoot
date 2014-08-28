exports.GamePadWindow = function(gamePadController) {	
	var gamePadWindow = require("ui/common/controls").CustomTitleWindow(gamePadController.Name);
	gamePadWindow.Controller = gamePadController;
	
	return gamePadWindow;
};