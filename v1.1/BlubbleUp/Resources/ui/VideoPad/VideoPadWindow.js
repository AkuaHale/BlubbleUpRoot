exports.VideoPadWindow = function(videoPadController) {	
	var videoPadWindow = require("ui/common/controls").CustomTitleWindow(videoPadController.Name);
	videoPadWindow.Controller = videoPadController;
	
	return videoPadWindow;
};