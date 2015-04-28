var Compression = require('ti.compression');

var BlubblePeer = require('data/BlubblePeer');
var Photo = require('data/Photo');
var Event = require('service/Event');
var ImageManager = require('ImageManager');
var Message = require('service/Message');
var MessageReactor = require('service/MessageReactor');
var PeerRegistry = require('service/PeerRegistry');
var TaskManager = require('TaskManager');
var Constants = require('Constants');

function ReactorRegistry(){
}

ReactorRegistry.prototype.ReactorDict = {};

ReactorRegistry.prototype.Register = function(reactor_){
	if(!this.ReactorDict[reactor_.Key]){
		this.ReactorDict[reactor_.Key] = reactor_;
	}
};

ReactorRegistry.prototype.Get = function(key_){
	return this.ReactorDict[key_];
};

var ProcessImageContainingItem = function(item_){
	if(item_.Image != null){
		var filename = Titanium.Filesystem.applicationDataDirectory +item_.Name+".jpg";
		f = Titanium.Filesystem.getFile(filename);
		f.write(Ti.Utils.base64decode(item_.Image));
		Titanium.API.info(filename);
		item_.Image = filename;			
	}
};

ReactorRegistry.prototype.Initialize = function(){
	this.Register(new MessageReactor(Constants.prototype.BLUBBLE_GET_MESSAGE, function(message_){
		Ti.API.info('Processing Message:'+JSON.stringify(message_));
		Ti.App.fireEvent(Constants.prototype.BLUBBLE_REQUEST_EVENT,{SourceAddress:message_.Args.SourceAddress});	
	}));	
	this.Register(new MessageReactor(Constants.prototype.BLUBBLE_PHOTO_REQUEST_MESSAGE, function(message_){
		Ti.API.info('Processing Message:'+JSON.stringify(message_));
		var blubbleManager = Alloy.Globals.blubbleManager;
		var loggedInBlubble = Alloy.Globals.loggedInBlubble;
		var padName = message_.Args.PadName;
		var padItemName = message_.Args.PadItemName;
		var photoId = message_.Args.PhotoId;
		Ti.API.info('Logged Inblubble:'+JSON.stringify(loggedInBlubble));
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
									blubbleManager.PublishToPeer(message_.Args.BlubbleName, new Message(Constants.prototype.BLUBBLE_PHOTO_UPDATE_MESSAGE,{
										BlubbleName:Alloy.Globals.loggedInBlubble.Name,
										PadName:message_.Args.PadName,
										PadItemName:message_.Args.PadItemName,
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
	}));	
	this.Register(new MessageReactor(Constants.prototype.BLUBBLE_PHOTO_UPDATE_MESSAGE, function(message_){
		Ti.API.info('Processing Message:'+JSON.stringify(message_));
		var photo = message_.Args.Photo;
		TaskManager.prototype.NewTask(function(){
			ProcessImageContainingItem(photo);
			return photo;
		},function(photo){
			Ti.App.fireEvent(Constants.prototype.BLUBBLE_PHOTO_UPDATE_EVENT,{
				BlubbleName:message_.Args.BlubbleName,
				PadName:message_.Args.PadName,
				PadItemName:message_.Args.PadItemName,
				Photo:photo
				});							
		});
	}));	
	this.Register(new MessageReactor(Constants.prototype.BLUBBLE_MESSAGE, function(message_){
		Ti.API.info('Processing Message:'+JSON.stringify(message_));
		Ti.App.fireEvent(Constants.prototype.BLUBBLE_MESSAGE_RECEIVED_EVENT,{
			BlubbleMessage:message_.Args.BlubbleMessage
			});	
	}));	
};

module.exports = ReactorRegistry;
