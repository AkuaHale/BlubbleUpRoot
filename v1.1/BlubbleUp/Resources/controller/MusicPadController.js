exports.MusicPadController = function(blubble) {
  var musicPadController = {Name:'Music',
  Image:'images/music.png'};

	musicPadController.getWindow = function(){
		return require("ui/MusicPad/MusicPadWindow").MusicPadWindow(musicPadController);
	};

  return musicPadController;
};