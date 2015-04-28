var Constants = require('Constants');
var ImageManager = require('ImageManager');
var Message = require('service/Message');
var Album = require('data/Album');
var Photo = require('data/Photo');
var BlubbleMessage = require('service/BlubbleMessage');
var BlubbleKey = require('service/BlubbleKey');
var BlubbleAction = require('service/BlubbleAction');
var TaskManager = require('TaskManager');

var MediaPickerModule = require('/MediaPicker').MediaPicker;
var MediaPicker = new MediaPickerModule();

var args = arguments[0] || {};
var currentWindow = $._albumWindow;
var blubbleManager = Alloy.Globals.blubbleManager;
var blubble = args.blubble;
var pad = args.pad;
var album = args.album;
var gridItems = [];

var addGridItem = function(item){
	
	Ti.API.info('item being added:'+JSON.stringify(item));
	
	//CREATES A VIEW WITH OUR CUSTOM LAYOUT
	var gridItemController = Alloy.createController('item_gallery',{
		image:item.Thumbnail,
		title:item.Name,
		width:$._itemGrid.getItemWidth(),
		height:$._itemGrid.getItemHeight()
	});
	
	var values = {
		id: item.Name,
		title: item.Name,
		image: item.Thumbnail
	};
	
	var gridItem = {
		Id: item.Name,
		id: item.Name,
		controller: gridItemController,
		view: gridItemController.getView(),
		data: values
	}; 
	gridItems.push(gridItem);
	$._itemGrid.addGridItem(gridItem);	
};

var updateGridItem = function(item){
	Ti.API.info('Updating Album photo grid');
	var foundIndex = -1;
	var gridItemCount = gridItems.length;
	for(var i=0; i<gridItemCount; i++){
		Ti.API.info('Current Item:'+gridItems[i].id);
		if(item.Name == gridItems[i].id){
			foundIndex = i;
		}
	}
	
	Ti.API.info('Found Index:'+foundIndex);
	if(foundIndex > -1){
			//Update Logic
			var childController = gridItems[foundIndex].controller;
			Ti.API.info('Image:'+item.Image);
			childController.UpdateImage(item.Thumbnail);
		}
		else{
			addGridItem(item);
		}	
};

var removeGridItem = function(item){
	$._itemGrid.removeGridItem(item.Id);	
};

var showGridItemInfo = function(e){
	Ti.API.info(JSON.stringify(e.source.data));
	var childController = Alloy.createController('PhotoWindow', {blubble:blubble, pad:pad, album:album, photoId: e.source.data.id});
	Alloy.Globals.tabGroup.activeTab.open(childController.getView());
};

//INITIALIZE TIFLEXIGRID
$._itemGrid.init({
	columns:4,
	space:5,
	gridBackgroundColor:'#fff',
	itemHeightDelta: 0,
	itemBackgroundColor:'#eee',
	itemBorderColor:'transparent',
	itemBorderWidth:0,
	itemBorderRadius:0,
	onItemClick: showGridItemInfo
});

//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function InitData(){
	var items = album.Items;			
	for (var x=0;x<items.length;x++){
		addGridItem(items[x]);
	};
};

InitData();

if(blubble.Name == Alloy.Globals.loggedInBlubble.Name){
	$._addBtn.addEventListener('click', function(e){
		var callback = function(items) {
			var views = [];
			var iterate = function(item) {
				Ti.API.info('Item Id:'+item.id+' url:'+item.url);
				MediaPicker.getImageByURL({
					key: item.url,
					id: item.id,
					success: function(e) {
						Ti.API.info('API Name:'+e.image.apiName);
						var imgView = Ti.UI.createImageView({image: e.image.apiName == 'Ti.Blob' ? e.image : 'file://'+e.image});
						views.push(imgView);
				    	var photo = new Photo(album.Name+album.Items.length);
				    	Ti.API.info('Photo:'+photo.Name);
						var filename = Titanium.Filesystem.applicationDataDirectory+photo.Name+".png";
						f = Titanium.Filesystem.getFile(filename);
						f.write(imgView.toImage());
						Titanium.API.info(filename);
						photo.Image = filename;
						photo.Thumbnail = filename;
						album.Items.push(photo);
						addGridItem(photo);
						var newPhoto = new Photo(photo.Name);
						var imageView = Ti.UI.createImageView();
						imageView.image = photo.Image;
						var smallImage = ImageManager.prototype.ImageAsThumbnail(imageView.toImage(), 48, 1, 0);
						var encoded = Ti.Utils.base64encode(smallImage);
						newPhoto.Thumbnail = encoded.toString();
						var blubbleKey = new BlubbleKey(blubble.Name, pad.Name, album.Name,{Photo:newPhoto.Name});
						var blubbleAction = new BlubbleAction(BlubbleAction.prototype.ADD_ACTION);
						var blubbleMessage = new BlubbleMessage(blubbleKey, blubbleAction, {Photo:newPhoto});
						blubbleManager.Publish(new Message(Constants.prototype.BLUBBLE_MESSAGE,{
								BlubbleMessage:blubbleMessage
							}));
						if (items.length) iterate(items.splice(0,1)[0]);
						else {
							//Final
						}
					}
				});			
			};
			if (items.length) iterate(items.splice(0,1)[0]);
		};
		MediaPicker.show(callback, 50, 'photos', 'Choose up to four images! Longlick image for preview.');
	});
}else{
	var emptyView = Titanium.UI.createView({});
	$._albumWindow.rightNavButton = emptyView;
}

Ti.App.addEventListener(Constants.prototype.BLUBBLE_MESSAGE_RECEIVED_EVENT, function(e){
	var blubbleMessage = e.BlubbleMessage;
	var blubbleKey = blubbleMessage.Key; 
	if(blubbleKey.Blubble == blubble.Name){
		if(blubbleKey.Pad == pad.Name){
			if(blubbleKey.PadItem == album.Name){
				if(blubbleKey.ExKeys.Photo != null){
					Ti.API.info('Album: Received Album Event:'+JSON.stringify(blubbleMessage));
					var blubbleAction = blubbleMessage.Action;
					switch(blubbleAction.Value){
						case BlubbleAction.prototype.ADD_ACTION :
						Ti.API.info('Adding Photo');
						var newPhoto = blubbleMessage.Args.Photo; 
						var filename = Titanium.Filesystem.applicationDataDirectory +blubble.Name+'_'+newPhoto.Name+".jpg";
						f = Titanium.Filesystem.getFile(filename);
						f.write(Ti.Utils.base64decode(newPhoto.Thumbnail));
						Titanium.API.info(filename);
						newPhoto.Thumbnail = filename;	
						album.Items.push(newPhoto);		
						addGridItem(newPhoto);
						/*
						if(newPhoto.Image == null){
							var subscribeKey = new BlubbleKey(blubble.Name, pad.Name, album.Name,{Photo:newPhoto.Name});
							var subscribeAction = new BlubbleAction(BlubbleAction.prototype.SUBSCRIBE_ACTION);
							var subscribeMessage = new BlubbleMessage(subscribeKey, subscribeAction, {SourceAddress:Alloy.Globals.loggedInBlubble.IPAddress});
							blubbleManager.Publish(new Message(Constants.prototype.BLUBBLE_MESSAGE,{
									BlubbleMessage:subscribeMessage
								}));								
						}
						*/
						break;
						case BlubbleAction.prototype.UPDATE_ACTION :
						TaskManager.prototype.NewTask(function(){
							Ti.API.info('Updating Photo');
							var newPhoto = blubbleMessage.Args.Photo; 
							var filename = Titanium.Filesystem.applicationDataDirectory +blubble.Name+'_'+newPhoto.Name+".jpg";
							f = Titanium.Filesystem.getFile(filename);
							f.write(Ti.Utils.base64decode(newPhoto.Thumbnail));
							Titanium.API.info(filename);
							newPhoto.Thumbnail = filename;	
							return newPhoto;
						},function(newPhoto){
							album.Items.push(newPhoto);		
							updateGridItem(newPhoto);
						});
						break;
						case BlubbleAction.prototype.DELETE_ACTION :
						Ti.API.info('Deleting Photo');
						removeGridItem(blubbleKey.ExKeys.Photo);
						break;
					}									
				}
			}
		}
	}
});

Ti.App.addEventListener(Constants.prototype.BLUBBLE_PHOTO_UPDATE_EVENT, function(e){
	Ti.API.info('Got Photo Update event:'+JSON.stringify(e));
	var blubbleName = e.BlubbleName;
	if(blubbleName == blubble.Name){
		var padName = e.PadName;
		if(padName == pad.Name){
		var padItemName = e.PadItemName;
		if(padItemName == album.Name){
			var photo = e.Photo;
				for(var i=0; i<album.Items.length; i++){			
					if(album.Items[i].Id == photo.Id){
						album.Items[i].Image = photo.Image;
						break;
					}			
				}					
			}			
		}
	}
});	
