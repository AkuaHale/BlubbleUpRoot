function SocketHelper(){

	this.SOCKET_BLUBBLE_ADDED_EVENT = 'SOCKET_BLUBBLE_ADDED_EVENT';
	this.SOCKET_BLUBBLE_UPDATED_EVENT = 'SOCKET_BLUBBLE_UPDATED_EVENT';
	this.SOCKET_BLUBBLE_DELETED_EVENT = 'SOCKET_BLUBBLE_DELETED_EVENT';

	this.SOCKET_BLUBBLE_PAD_ADDED_EVENT = 'SOCKET_BLUBBLE_PAD_ADDED_EVENT';
	this.SOCKET_BLUBBLE_PAD_UPDATED_EVENT = 'SOCKET_BLUBBLE_PAD_UPDATED_EVENT';
	this.SOCKET_BLUBBLE_PAD_DELETED_EVENT = 'SOCKET_BLUBBLE_PAD_DELETED_EVENT';

	var io = require('socket.io-titanium');	
	var self = this;

	var socket = io.connect('127.0.0.1:8080');
	var blubbleUpChannel = socket.of('/blubbleUp');
	
	blubbleUpChannel.on('pad.new', function(evtData){
	if(evtData && evtData.Pads && evtData.Pads.length){
	  for(var i=0; i<evtData.Pads.length; i++){
		var pad = evtData.Pads[i];
		var newEvtData = {
			BlubbleName : evtData.BlubbleName,
			Pad : pad
		};
		Ti.App.fireEvent(self.SOCKET_BLUBBLE_PAD_ADDED_EVENT+'.'+evtData.BlubbleName, newEvtData);
	  }		
	}	
	});				
	
	this.SubscribeForBlubbles = function(){
		var socket = io.connect('127.0.0.1:8080');
		var blubbleUpChannel = socket.of('/blubbleUp');
		blubbleUpChannel.on('blubble.new', function(blubbles){
		  for(var i=0; i<blubbles.length; i++){
			var blubble = blubbles[i];
			var evtData = {
				Blubble : blubble
			};
			Ti.App.fireEvent(self.SOCKET_BLUBBLE_ADDED_EVENT, evtData);													 	
		  }
		});			
	};

	this.SubscribeForPads = function(blubbleName){
		var socket = io.connect('127.0.0.1:8080');
		var blubbleUpChannel = socket.of('/blubbleUp');
	    blubbleUpChannel.emit('blubble:subscribe', {
	      channelId: blubbleName
	    });
	};

	this.UnsubscribeForPads = function(blubbleName){
		var socket = io.connect('127.0.0.1:8080');
		var blubbleUpChannel = socket.of('/blubbleUp');
	    blubbleUpChannel.emit('blubble:unsubscribe', {
	      channelId: blubbleName
	    });
	};

};

module.exports = SocketHelper;
