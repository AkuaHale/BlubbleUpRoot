exports.BlubblePadSubscriber = function(){
	var blubblePadSubscriber = {};

	blubblePadSubscriber.BLUBBLE_ADDED_EVENT = 'BLUBBLE_ADDED_EVENT';
	blubblePadSubscriber.BLUBBLE_UPDATED_EVENT = 'BLUBBLE_UPDATED_EVENT';
	blubblePadSubscriber.BLUBBLE_DELETED_EVENT = 'BLUBBLE_DELETED_EVENT';
	
	var Discover = require('lib/discover');
	var d = new Discover({ key : "blubbleSubscriber", weight : Date.now() * -1, mastersRequired : 2 });		
	d.on("added", function (obj) {
		console.log("New node discovered on the network.");
	});
	
	d.on("promotion", function (obj) {
		console.log("I was promoted");
	});
	
	d.on("demotion", function (obj) {
		console.log('I was demoted');
	});
	
	d.on("removed", function (obj) {
		console.log("Node lost from the network.");
	});
	
	d.on("error", function (err) {
		console.log("error", err);
	});
	
	blubblePadSubscriber.Discover = d;

	blubblePadSubscriber.subscribe = function(){
		var channelName = 'BlubbleChannel';
		var success = blubblePadSubscriber.Discover.join(channelName, function (data) {
			if(data != null){
				if(data.BlubbleEventType == 'BlubbleAdded'){
					var evtData = {
						Blubble : data.Blubble
					};
					Ti.App.fireEvent(blubblePadSubscriber.BLUBBLE_ADDED_EVENT, evtData);									
				}
				else if(data.BlubbleEventType == 'BlubbleDeleted'){
					var evtData = {
						Blubble : data.Blubble
					};
					Ti.App.fireEvent(blubblePadSubscriber.BLUBBLE_DELETED_EVENT, evtData);									
				}
				else if(data.BlubbleEventType == 'BlubbleUpdated'){
					var evtData = {
						Blubble : data.Blubble
					};
					Ti.App.fireEvent(blubblePadSubscriber.BLUBBLE_UPDATED_EVENT, evtData);									
				}
			};
			
			
		    if (data.anyText) {
		    	console.log('Data received: '+data.anyText);
		    }
		});
		
		if (!success) {
		    console.log('Unable to join '+channelName+' channel.');
		}						
	};
	
	return blubblePadSubscriber;
};