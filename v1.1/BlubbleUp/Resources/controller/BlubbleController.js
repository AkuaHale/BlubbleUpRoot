exports.BlubbleController = function(blubble, socketHelper){
	var blubbleController = {};
	blubbleController.Blubble = blubble;
	blubbleController.SocketHelper = socketHelper;

	blubbleController.BLUBBLE_PAD_ADDED_EVENT = 'BLUBBLE_PAD_ADDED_EVENT';
	blubbleController.BLUBBLE_PAD_UPDATED_EVENT = 'BLUBBLE_PAD_UPDATED_EVENT';
	blubbleController.BLUBBLE_PAD_DELETED_EVENT = 'BLUBBLE_PAD_DELETED_EVENT';
	
	var dataHelper;
	if(blubble.IsRemote){
		var AppDataHelper = require('util/ApplicationDataHelper');
		var MockNetworkDataHelper = require('util/MockNetworkDataHelper');
		var RemoteDataHelper = require('util/RemoteDataHelper');
		dataHelper = new RemoteDataHelper(new MockNetworkDataHelper(blubble.Name, new AppDataHelper()));		
	} 
	else{
		var AppDataHelper = require('util/ApplicationDataHelper');
		var LocalDataHelper = require('util/LocalDataHelper');
		dataHelper = new LocalDataHelper(new AppDataHelper());
	}
	blubbleController.DataHelper = dataHelper;
	blubbleController.Controllers = [];
	if(blubble.Pads != null){
		for(var i=0; i<blubble.Pads.length; i++){
			blubbleController.Controllers.push(require('controller/PadControllerFactory').GetPadController(blubble.Pads[i], blubble, dataHelper));
		}		
	}

	blubbleController.BlubblePadAddedHandler = function(evtData){
		evtData.PadController = require('controller/PadControllerFactory').GetPadController(evtData.Pad, blubbleController.Blubble, blubbleController.DataHelper);
		Ti.App.fireEvent(blubbleController.BLUBBLE_PAD_ADDED_EVENT, evtData);					
	};

	blubbleController.Subscribe = function(){
		if(blubbleController.SocketHelper != null){
			Ti.App.addEventListener(blubbleController.SocketHelper.SOCKET_BLUBBLE_PAD_ADDED_EVENT+'.'+blubbleController.Blubble.Name, blubbleController.BlubblePadAddedHandler);					
			blubbleController.SocketHelper.SubscribeForPads(blubbleController.Blubble.Name);
		}
	};
	
	blubbleController.Unsubscribe = function(){
		if(blubbleController.SocketHelper != null){
			blubbleController.SocketHelper.UnsubscribeForPads(blubbleController.Blubble.Name);
			Ti.App.removeEventListener(blubbleController.SocketHelper.SOCKET_BLUBBLE_PAD_ADDED_EVENT+'.'+blubbleController.Blubble.Name, blubbleController.BlubblePadAddedHandler);
		}
	};
	return blubbleController;
};