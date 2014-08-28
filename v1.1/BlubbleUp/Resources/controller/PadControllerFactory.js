exports.GetPadController = function(pad, blubble, dataHelper){
	var padController;
	switch(pad.Name){
		case 'Photos':
		padController = require('controller/PhotoPadController').PhotoPadController(blubble, dataHelper);
		break;
		case 'Music':
		padController = require('controller/MusicPadController').MusicPadController(blubble, dataHelper);
		break;
		case 'Video':
		padController = require('controller/VideoPadController').VideoPadController(blubble, dataHelper);
		break;
		case 'Devices':
		padController = require('controller/DevicePadController').DevicePadController(blubble, dataHelper);
		break;
		case 'Games':
		padController = require('controller/GamePadController').GamePadController(blubble, dataHelper);
		break;		
	}
	return padController;
};