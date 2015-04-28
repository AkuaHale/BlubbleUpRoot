var Constants = require('Constants');
var Album = require('data/Album');
var Message = require('service/Message');
var BlubbleMessage = require('service/BlubbleMessage');
var BlubbleKey = require('service/BlubbleKey');
var BlubbleAction = require('service/BlubbleAction');

var args = arguments[0] || {};
var currentWindow = $._photoPadWindow;
var blubble = args.blubble;
var pad = args.pad;
var blubbleManager = Alloy.Globals.blubbleManager;
var gridItems = [];

var addGridItem = function(item){
	
	Ti.API.info('Album being added:'+JSON.stringify(item));
	
	//CREATES A VIEW WITH OUR CUSTOM LAYOUT
	var gridItemController = Alloy.createController('item_gallery',{
		image:item.getImage(),
		title:item.Name,
		width:$._itemGrid.getItemWidth()-20,
		height:$._itemGrid.getItemHeight()-20,
		showTitle:true
	});
	
	var values = {
		id: item.Name,
		title: item.Name,
		image: item.getImage()
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
	var foundIndex = -1;
	var gridItemCount = gridItems.length;
	for(var i=0; i<gridItemCount; i++){
		if(item.Name == gridItems[i].id){
			foundIndex = i;
		}
	}
	
	if(foundIndex > -1){
			//Update Logic
			var childController = gridItems[foundIndex].controller;
			Ti.API.info('Image:'+item.getImage());
			childController.UpdateImage(item.getImage());
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
	var selectedAlbumName = e.source.data.id;
	for(var i=0; i<pad.Items.length; i++){
		if(selectedAlbumName == pad.Items[i].Name){
			var childController = Alloy.createController('AlbumWindow', {blubble:blubble, pad:pad, album:pad.Items[i]});
			if(childController != null){
				Alloy.Globals.tabGroup.activeTab.open(childController.getView());
			}
			break;
		}		
	}
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
	itemBorderRadius:40,
	onItemClick: showGridItemInfo
});

//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function InitData(){
	var items = pad.Items;			
	for (var x=0;x<items.length;x++){
		addGridItem(items[x]);
	};
};

InitData();

if(blubble.Name == Alloy.Globals.loggedInBlubble.Name){
	$._addBtn.addEventListener('click', function(e){
		$._albumPopup.show();
	});	
}else{
	var emptyView = Titanium.UI.createView({});
	$._photoPadWindow.rightNavButton = emptyView;
}


function cleanup(){
	$._albumNameTxtField.reset();
}

function done(e){
	var newAlbumName = $._albumNameTxtField.getValue();
	var newAlbum = new Album(newAlbumName);
	pad.Items.push(newAlbum);
	addGridItem(newAlbum);
	var blubbleKey = new BlubbleKey(blubble.Name, pad.Name, newAlbum.Name);
	var blubbleAction = new BlubbleAction(BlubbleAction.prototype.ADD_ACTION);
	var blubbleMessage = new BlubbleMessage(blubbleKey, blubbleAction, {Album:newAlbum});
	blubbleManager.Publish(new Message(Constants.prototype.BLUBBLE_MESSAGE,{
			BlubbleMessage:blubbleMessage
		}));
	cleanup();
	$._albumPopup.hide();
}

function cancel(e){
	cleanup();
	$._albumPopup.hide();
}

Ti.App.addEventListener(Constants.prototype.BLUBBLE_MESSAGE_RECEIVED_EVENT, function(e){
	var blubbleMessage = e.BlubbleMessage;
	var blubbleKey = blubbleMessage.Key; 
	if(blubbleKey.Blubble == blubble.Name){
		if(blubbleKey.Pad == pad.Name){
			if(blubbleKey.PadItem != null){
				if(blubbleKey.ExKeys == null){
					Ti.API.info('PhotoPad: Received PhotoPad Event:'+JSON.stringify(blubbleMessage));
					var blubbleAction = blubbleMessage.Action;
					switch(blubbleAction.Value){
						case BlubbleAction.prototype.ADD_ACTION :
						Ti.API.info('Adding Album');
						var msgAlbum = blubbleMessage.Args.Album; 
						if(msgAlbum != null){
							var newAlbum = new Album(msgAlbum.Name,msgAlbum.Image,msgAlbum.Items,msgAlbum.IsPublic);
							addGridItem(newAlbum);
							if(blubble.IsRemote != false){
								pad.Items.push(newAlbum);
							}									
						}
						break;
						case BlubbleAction.prototype.UPDATE_ACTION :
						Ti.API.info('Updating Album');
						var msgAlbum = blubbleMessage.Args.Album; 
						var updAlbum = new Album(msgAlbum.Name,msgAlbum.Image,msgAlbum.Items,msgAlbum.IsPublic);
						updateGridItem(updAlbum);
						break;
						case BlubbleAction.prototype.DELETE_ACTION :
						Ti.API.info('Deleting Album');
						removeGridItem(blubbleKey.PadItem);
						break;
					}									
				}
			}
		}
	}
});
