var Constants = require('Constants');
var Pad = require('data/Pad');
var BlubbleAction = require('service/BlubbleAction');

var args = arguments[0] || {};
Ti.API.info('Blubble Pad args:'+JSON.stringify(args));
var blubbleManager = Alloy.Globals.blubbleManager;
var currentWindow = $._blubblePadWindow;
var gridItems = [];

var addBlubbleGridItem = function(blubble){
	//CREATES A VIEW WITH OUR CUSTOM LAYOUT
	var gridItemController = Alloy.createController('item_gallery',{
		image:blubble.Image,
		title:blubble.Name,
		width:$._blubbleGrid.getItemWidth()-20,
		height:$._blubbleGrid.getItemHeight()-20,
		showTitle:true
	});
	
	//THIS IS THE DATA THAT WE WANT AVAILABLE FOR THIS ITEM WHEN onItemClick OCCURS
	var values = {
		id:blubble.Name,
		title: blubble.Name,
		image: blubble.Image,
		childController:Alloy.createController('BlubbleWindow', {blubble:blubble})
	};
	
	var gridItem = {
		Id: blubble.Name,
		id: blubble.Name,
		controller: gridItemController,
		view: gridItemController.getView(),
		data: values
	}; 
	gridItems.push(gridItem);
	$._blubbleGrid.addGridItem(gridItem);	
};

var updateBlubbleGridItem = function(blubble){
	var foundIndex = -1;
	var gridItemCount = gridItems.length;
	for(var i=0; i<gridItemCount; i++){
		if(blubble.Name == gridItems[i].id){
			foundIndex = i;
		}
	}
	
	if(foundIndex > -1){
			//Update Logic
			var childController = gridItems[foundIndex].controller;
			Ti.API.info('Blubble Image:'+blubble.Image);
			childController.UpdateImage(blubble.Image);
		}
		else{
			addBlubbleGridItem(blubble);
		}	
};

var removeBlubbleGridItem = function(blubble){
	$._blubbleGrid.removeGridItem(blubble.Id);	
};

//CUSTOM FUNCTION TO DEFINE WHAT HAPPENS WHEN AN ITEM IN THE GRID IS CLICKED
var showGridItemInfo = function(e){
	var childController = e.source.data.childController;
	Alloy.Globals.tabGroup.activeTab.open(childController.getView());
};

//INITIALIZE TIFLEXIGRID
$._blubbleGrid.init({
	columns:4,
	space:5,
	gridBackgroundColor:'#fff',
	itemHeightDelta: 0,
	itemBackgroundColor:'transparent',
	itemBorderColor:'transparent',
	itemBorderWidth:0,
	itemBorderRadius:0,
	onItemClick: showGridItemInfo
});

//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function InitData(){
	var blubbles = blubbleManager.GetBlubbles();			
	for (var x=0;x<blubbles.length;x++){
		addBlubbleGridItem(blubbles[x]);
	};
};

InitData();

// EXAMPLE OF HOW TO USE TIFLEXIGRID IN iOS & ANDROID
// WITH DIFFERENT LAYOUTS IN ORIENTATION CHANGES
/*
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
	
    $._blubbleGrid.clearGrid();
    $._blubbleGrid.init({
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
    InitData();  
});
*/

Ti.App.addEventListener(Constants.prototype.BLUBBLE_MESSAGE_RECEIVED_EVENT, function(e){
	var blubbleMessage = e.BlubbleMessage;
	var blubbleKey = blubbleMessage.Key; 
	if(blubbleKey.Blubble != null){
		if(blubbleKey.Pad == null){
			Ti.API.info('BubblePad: Received Blubble Event:'+JSON.stringify(blubbleMessage));
			var blubbleAction = blubbleMessage.Action;
			switch(blubbleAction.Value){
				case BlubbleAction.prototype.ADD_ACTION :
				Ti.API.info('Adding Blubble');
				var newBlubble = blubbleMessage.Args.Blubble; 
				addBlubbleGridItem(newBlubble);				
				break;
				case BlubbleAction.prototype.UPDATE_ACTION :
				Ti.API.info('Updating Blubble');
				var newBlubble = blubbleMessage.Args.Blubble; 
				updateBlubbleGridItem(newBlubble);
				break;
				case BlubbleAction.prototype.DELETE_ACTION :
				Ti.API.info('Deleting Blubble');
				removeBlubbleGridItem(blubbleKey.Blubble);
				break;
			}
		}
	}
});
