var Blubble = require('data/Blubble');
var Photo = require('data/Photo');
var BlubbleMessage = require('service/BlubbleMessage');
var BlubbleKey = require('service/BlubbleKey');
var BlubbleAction = require('service/BlubbleAction');
var Constants = require('Constants');
var ImageManager = require('ImageManager');
var Message = require('service/Message');
var PeerRegistry = require('service/PeerRegistry');
var UDPPeerManager = require('service/UDPPeerManager');
var TCPPeerManager = require('service/TCPPeerManager');
var TaskManager = require('TaskManager');

var _discoveredBlubbles = []; 
var _loggedInBlubble;
var _tcpPeerManager;

var GenerateBlubbleForMessage = function(blubble_){
	var blubbleToBeSent = new Blubble(blubble_.Id, blubble_.UserName, blubble_.Name);
	if(blubble_.Image != null)
	{			
		var imageView = Ti.UI.createImageView();
		imageView.image = blubble_.Image;
		var smallImage = ImageManager.prototype.ImageAsThumbnail(imageView.toImage(), 48, 1, 0);
		var encoded = Ti.Utils.base64encode(smallImage);
		blubbleToBeSent.Image = encoded.toString();
	}
	var newPads = [];
	if(blubble_.Pads != null){
		for(var i=0; i<blubble_.Pads.length; i++){
			if(blubble_.Pads[i].IsPublic){
				newPads.push(blubble_.Pads[i]);
			}
		}		
	}
	blubbleToBeSent.Pads = newPads;
	return blubbleToBeSent;
};

function BlubbleManager(loggedInBlubble_){

this.DISCOVERY_PORT = 41234;
this.COMMUNICATION_PORT = 41232;

_loggedInBlubble = loggedInBlubble_;
_loggedInBlubble.IPAddress = Titanium.Platform.address;
_loggedInBlubble.Port = this.COMMUNICATION_PORT;

_tcpPeerManager = new TCPPeerManager(loggedInBlubble_);
var	udpPeerMgr = new UDPPeerManager(this.DISCOVERY_PORT);
			
this.DiscoverBlubbles = function(){
	Ti.App.addEventListener(udpPeerMgr.DISCOVERED_EVENT, function(e){
		var address = e.Peer.IPAddress+':'+e.Peer.Port;
		Ti.API.info('Discovered:'+JSON.stringify(e.Peer));
		_tcpPeerManager.ConnectToPeer(e.Peer);
	});
	
	Ti.App.addEventListener(udpPeerMgr.CONNECT_EVENT, function(e){
		var address = e.Peer.IPAddress+':'+e.Peer.Port;
		Ti.API.info('Connected:'+JSON.stringify(e.Peer));
		_tcpPeerManager.ConnectToPeer(e.Peer);
	});
	
	udpPeerMgr.DiscoverPeers({
		BlubbleName:_loggedInBlubble.Name, 
		IPAddress:_loggedInBlubble.IPAddress, 
		CommunicationPort:_loggedInBlubble.Port
		});
};

this.GetBlubbles = function(){
	return _discoveredBlubbles;
};

Ti.App.addEventListener('PROFILE_PIC_UPDATED', function(e){
	var originalImage = e.ProfileImage;
    _loggedInBlubble.Image = originalImage;	
	TaskManager.prototype.NewTask(function(){
	    var blubbleToBeSent = GenerateBlubbleForMessage(_loggedInBlubble);
			return blubbleToBeSent;
	},function(blubbleToBeSent){
		BlubbleManager.prototype.Publish(new Message(Constants.prototype.BLUBBLE_UPDATE_MESSAGE, {
			Blubble:blubbleToBeSent
			}));
	});
});

Ti.App.addEventListener(Constants.prototype.BLUBBLE_MESSAGE_RECEIVED_EVENT, function(e){
	var blubbleMessage = e.BlubbleMessage;
	var blubbleKey = blubbleMessage.Key; 
	var blubbleAction = blubbleMessage.Action;
	var loggedInBlubble = Alloy.Globals.loggedInBlubble;
	switch(blubbleAction.Value){
		case BlubbleAction.prototype.SUBSCRIBE_ACTION :
		Ti.API.info('Subscribe Request Received for Key:'+JSON.stringify(blubbleKey));
		var peer = PeerRegistry.prototype.GetPeerByAddress(blubbleMessage.Args.SourceAddress);
		if(blubbleKey.Pad == null){
			TaskManager.prototype.NewTask(function(){
				var blubbleToBeSent = GenerateBlubbleForMessage(loggedInBlubble);
				var blubbleToBeSentMessage = new BlubbleMessage(new BlubbleKey(blubbleToBeSent.Name), 
				new BlubbleAction(BlubbleAction.prototype.ADD_ACTION), 
				{Blubble:blubbleToBeSent});
				return blubbleToBeSentMessage;
			},function(blubbleToBeSentMessage){
				_tcpPeerManager.Publish(peer, new Message(Constants.prototype.BLUBBLE_MESSAGE,{
						BlubbleMessage:blubbleToBeSentMessage
					}));			
			});
		}
		else if(blubbleKey.PadItem == null){
			//Send Pad Info
		}
		else if(blubbleKey.ExKeys == null){
			//Send Pad Item Info
		}
		else{
			var photoId = blubbleKey.ExKeys.Photo;
			if(photoId != null){

				var padName = blubbleKey.Pad;
				var padItemName = blubbleKey.PadItem;
				for(var i=0; i<loggedInBlubble.Pads.length; i++){
					Ti.API.info('Going through pad:'+loggedInBlubble.Pads[i].Name);
					if(loggedInBlubble.Pads[i].Name == padName){
						var pad = loggedInBlubble.Pads[i];
						for(var j=0; j<pad.Items.length; j++){
							Ti.API.info('Going through album:'+pad.Items[j].Name);
							if(pad.Items[j].Name == padItemName){
								var album = pad.Items[j];
								for(var k=0; k<album.Items.length; k++){
									Ti.API.info('Going through photo id:'+album.Items[k].Id);
									if(album.Items[k].Id == photoId){
										var photo = album.Items[k];										
										TaskManager.prototype.NewTask(function(){
												var photoToBeSent = new Photo(photo.Name, photo.Thumbnail, photo.Image);
												if(photo.Image != null)
												{			
													var imageView = Ti.UI.createImageView();
													imageView.image = photo.Image;
													var encoded = Ti.Utils.base64encode(imageView.toImage());
													photoToBeSent.Image = encoded.toString();
												}											
												return photoToBeSent;										    	
										},function(photoToBeSent){
												_tcpPeerManager.Publish(peer, new Message(Constants.prototype.BLUBBLE_PHOTO_UPDATE_MESSAGE,{
													BlubbleName:loggedInBlubble.Name,
													PadName:padName,
													PadItemName:padItemName,
													Photo:photoToBeSent,
												}));											
										});
										break;
									}
								}
								break;
							}
						}
						break;
					}
				}		
				
			}
		}
		break;
		case BlubbleAction.prototype.UNSUBSCRIBE_ACTION :
		Ti.API.info('Unsubscribe Request Received for Key:'+JSON.stringify(blubbleKey));
		break;
	}
	
	if(blubbleKey.Blubble != null){
		if(blubbleKey.Pad == null){
			Ti.API.info('BubblePad: Received Blubble Event:'+JSON.stringify(blubbleMessage));
		}
	}
});

};

BlubbleManager.prototype.Publish = function(message_){
	var allPeers = PeerRegistry.prototype.GetPeers();
	for(var i=0; i<allPeers.length; i++){
		_tcpPeerManager.Publish(allPeers[i],message_);
	}	
};

BlubbleManager.prototype.PublishToPeer = function(blubbleName_, message_){
	var peer = PeerRegistry.prototype.GetPeerByName(blubbleName_);
	_tcpPeerManager.Publish(peer,message_);
};

module.exports = BlubbleManager;