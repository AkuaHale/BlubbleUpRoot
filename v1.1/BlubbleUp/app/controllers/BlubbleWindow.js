var Constants = require('Constants');
var Message = require('service/Message');

var args = arguments[0] || {};
var currentWindow = $._blubbleWindow;
var blubble = args.blubble || {};
var gridItems = [];
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

$._blubbleWindow.title = blubble.Name;
if(blubble.Image != null){
	$._blubbleWindow.titleControl = GetTitleControl(blubble);	
}

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
		retController = Alloy.createController(controllerName, {blubble:blubble, pad:pad_});
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
	itemBorderWidth:0,
	itemBorderRadius:40,
	onItemClick: showGridItemInfo
});

//CUSTOM FUNCTION TO CREATE THE ITEMS FOR THE GRID
function InitData(){
	var items = blubble.Pads;			
	for (var x=0;x<items.length;x++){
		addGridItem(items[x]);
	};
};

InitData();

$._blubbleWindow.title = blubble.Name;
