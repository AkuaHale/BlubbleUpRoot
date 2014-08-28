exports.BlubblePadController = function(){
	var blubblePadController = {
		Name:'Blubbles',
		Image:'/images/groups-32.png'
	};
	
	var Blubble = require('data/Blubble');
	var SocketHelperProxy = require('util/SocketHelper');

	blubblePadController.BLUBBLE_ADDED_EVENT = 'BLUBBLE_ADDED_EVENT';
	blubblePadController.BLUBBLE_UPDATED_EVENT = 'BLUBBLE_UPDATED_EVENT';
	blubblePadController.BLUBBLE_DELETED_EVENT = 'BLUBBLE_DELETED_EVENT';
	
	blubblePadController.Blubbles =[];
	
	blubblePadController.SocketHelper = new SocketHelperProxy();

	blubblePadController.subscribe = function(){
		blubblePadController.SocketHelper.SubscribeForBlubbles();
		Ti.App.addEventListener(blubblePadController.SocketHelper.SOCKET_BLUBBLE_ADDED_EVENT,function(evtData){
			Ti.App.fireEvent(blubblePadController.BLUBBLE_ADDED_EVENT, evtData);
		});	
	};
	
	return blubblePadController;
};