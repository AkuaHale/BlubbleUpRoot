exports.MusicPadWindow = function(musicPadController) {	
	var musicPadWindow = require("ui/common/controls").CustomTitleWindow(musicPadController.Name);
	musicPadWindow.Controller = musicPadController;
	
	return musicPadWindow;
};