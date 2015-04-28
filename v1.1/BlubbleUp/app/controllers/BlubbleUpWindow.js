var Constants = require('Constants');
var BlubbleManager = require('service/BlubbleManager');
var ImageManager = require('ImageManager');

var args = arguments[0] || {};
var loggedInBlubble = Alloy.Globals.loggedInBlubble;
var blubbleManager = Alloy.Globals.blubbleManager;

var GetTitleControl = function(blubble_){
	var childView = Titanium.UI.createView({layout:'horizontal'});
	if(blubble_.Image != null){
		childView.add(Titanium.UI.createImageView({image:blubble_.Image, height:32, width:32}));
		childView.add(Titanium.UI.createLabel({text:blubble_.Name, left:5}));		
	}else{
		childView.add(Titanium.UI.createLabel({text:blubble_.Name}));				
	}
	var titleView = Titanium.UI.createView({width:'40%', Height:'80%'});
	titleView.add(childView);
	return titleView;	
};

$._blubbleUpWindow.title = loggedInBlubble.Name;
if(loggedInBlubble.Image != null){
	$._blubbleUpWindow.titleControl = GetTitleControl(loggedInBlubble);	
}

var gridItems = [];

Ti.App.addEventListener('PROFILE_PIC_UPDATED', function(e){
	loggedInBlubble.Image = e.ProfileImage;
	if(loggedInBlubble.Image != null){
		$._blubbleUpWindow.titleControl = GetTitleControl(loggedInBlubble);	
	}
	Ti.API.info('PROFILE_PIC_UPDATED:'+JSON.stringify(loggedInBlubble));
});

var GetController = function(pad_){
	var retController = null;
	var controllerName = null;
	Ti.API.info('Finding controller for Pad Name:'+pad_.Name);
	switch(pad_.Name){
		case 'Photos':
		controllerName = 'PhotoPadWindow';
		break;
		case 'Music':
		controllerName = 'MusicPadWindow';
		break;
		case 'Video':
		controllerName = 'VideoPadWindow';
		break;
		case 'Games':
		controllerName = 'GamePadWindow';
		break;
		case 'Devices':
		controllerName = 'DevicePadWindow';
		break;
	}
	if(controllerName != null){
		retController = Alloy.createController(controllerName, {blubble:loggedInBlubble, pad:pad_});
	}
	else{
		Ti.API.info('No Controller found!!!');
	}
	return retController;
};

var addGridItem = function(item){
	//CREATES A VIEW WITH OUR CUSTOM LAYOUT
	var gridItemController = Alloy.createController('item_gallery',{
		image:item.Image,
		title:item.Name,
		width:$._itemGrid.getItemWidth()-20,
		height:$._itemGrid.getItemHeight()-20,
		showTitle:true
	});
	
	var values = {
		id: item.Name,
		title: item.Name,
		image: item.Image,
		childController: GetController(item)
	};
	
	var gridItem = {
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
			Ti.API.info('Image:'+item.Image);
			childController.UpdateImage(item.Image);
		}
		else{
			addGridItem(item);
		}	
};

var showGridItemInfo = function(e){
	Ti.API.info(JSON.stringify(e.source.data));
	var childController = e.source.data.childController;
	if(childController != null){
		Alloy.Globals.tabGroup.activeTab.open(childController.getView());
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
	itemBorderWidth:10,
	itemBorderRadius:40,
	onItemClick: showGridItemInfo
});

//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function InitData(){
	var items = loggedInBlubble.Pads;			
	for (var x=0;x<items.length;x++){
		addGridItem(items[x]);
	};
};

InitData();

/*
// EXAMPLE OF HOW TO USE TIFLEXIGRID IN iOS & ANDROID
// WITH DIFFERENT LAYOUTS IN ORIENTATION CHANGES
Ti.Gesture.addEventListener('orientationchange', function(e){

    var orientation = e.orientation;
    var nColumn,nSpace;
    
    if(OS_ANDROID){
    	if (orientation < 1 || orientation > 4){
	    	return;
	    }
	    else if (orientation == 1){
	    	nColumn = 5;
			nSpace = 5;
	    }
	    else if (orientation == 2) {
	    	nColumn = 8;
			nSpace = 7;
	    }
    }
    else{
    	if (orientation < 1 || orientation > 4){
	    	return;
	    }
		else if (orientation == 1 || orientation == 2){
			nColumn = 5;
			nSpace = 5;
	    }
	    else if (orientation == 3 || orientation == 4) {
	    	nColumn = 8;
			nSpace = 7;
	    }
    }	
	
    $.fg.clearGrid();
    $.fg.init({
		columns:nColumn,
		space:nSpace,
		gridBackgroundColor:'#fff',
		itemHeightDelta: 0,
		itemBackgroundColor:'#eee',
		itemBorderColor:'transparent',
		itemBorderWidth:0,
		itemBorderRadius:0,
		onItemClick: showGridItemInfo
	});
    createSampleData();  
});
*/
