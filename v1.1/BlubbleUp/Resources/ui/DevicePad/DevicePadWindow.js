exports.DevicePadWindow = function(devicePadController) {	
	var devicePadWindow = require("ui/common/controls").CustomTitleWindow(devicePadController.Name);
	devicePadWindow.Controller = devicePadController;
	
	return devicePadWindow;
};