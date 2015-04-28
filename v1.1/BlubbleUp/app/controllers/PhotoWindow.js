var Compression = require('ti.compression');

var Constants = require('Constants');
var Message = require('service/Message');
var BlubbleMessage = require('service/BlubbleMessage');
var BlubbleKey = require('service/BlubbleKey');
var BlubbleAction = require('service/BlubbleAction');

var args = arguments[0] || {};
var blubble = args.blubble;
var album = args.album;
var pad = args.pad;
var photoId = args.photoId;
var blubbleManager = Alloy.Globals.blubbleManager;

var views = [];
var currentPage = 0;

var subscribeForPhoto = function(photo_){
	var blubbleKey = new BlubbleKey(blubble.Name, pad.Name, album.Name,{Photo:photo_.Name});
	var blubbleAction = new BlubbleAction(BlubbleAction.prototype.SUBSCRIBE_ACTION);
	var blubbleMessage = new BlubbleMessage(blubbleKey, blubbleAction, {SourceAddress:Alloy.Globals.loggedInBlubble.IPAddress});
	blubbleManager.Publish(new Message(Constants.prototype.BLUBBLE_MESSAGE,{
			BlubbleMessage:blubbleMessage
		}));	
};

for(var i=0; i<album.Items.length; i++){
	var image = album.Items[i].Image !=null ? album.Items[i].Image : album.Items[i].Thumbnail;
	views.push(Ti.UI.createImageView({image: image}));
	if(album.Items[i].Id == photoId){
		currentPage = i;
		var photoToBeScrolledTo = album.Items[i];
		if(photoToBeScrolledTo.Image == null){
			subscribeForPhoto(photoToBeScrolledTo);
		}
	}
}
$._sv.views = views;
$._sv.currentPage = currentPage;

if(blubble.IsRemote == true){
	$._sv.addEventListener('scrollend', function(e){
		var view = $._sv.views[$._sv.currentPage];
		Ti.API.info('Scroll View Current Page:'+$._sv.currentPage);
		var photoToBeScrolledTo = album.Items[$._sv.currentPage];
		if(photoToBeScrolledTo.Image == null){
			subscribeForPhoto(photoToBeScrolledTo);
		}
	});
}

var photoUpdateHandler = function(e){
	if($._sv != null){
		Ti.API.info('Got Photo Update event:'+JSON.stringify(e));
		var blubbleName = e.BlubbleName;
		if(blubbleName == blubble.Name){
			var padName = e.PadName;
			var padItemName = e.PadItemName;
			var photo = e.Photo;
			for(var i=0; i<album.Items.length; i++){
				
				if(album.Items[i].Id == photo.Id){
					$._sv.views[i].Image = photo.Image;
					album.Items[i].Image = photo.Image;
					break;
				}			
			}		
		}		
	} 
};

$._photoWindow.addEventListener('close', function(e){
	Ti.App.removeEventListener(Constants.prototype.BLUBBLE_PHOTO_UPDATE_EVENT, photoUpdateHandler);
});

$._photoWindow.addEventListener('open', function(e){
	Ti.App.addEventListener(Constants.prototype.BLUBBLE_PHOTO_UPDATE_EVENT, photoUpdateHandler);	
});

