exports.BlubblePadWindow = function(blubblePadController) {	
	var blubblePadWindow = require("ui/common/controls").CustomTitleWindow(blubblePadController.Name);
	blubblePadWindow.Controller = blubblePadController;

	Ti.App.addEventListener(blubblePadController.BLUBBLE_ADDED_EVENT,function(evtData){
		blubblePadController.BlubblePadWindow.addBlubbleButton(evtData.Blubble);   
	});	

	blubblePadWindow.createBlubbleButton = function(blubble){
		var blubbleBtn = require("ui/common/controls").ChildWindowButton(blubblePadWindow.containingTab, function(e){
			var blubbleController = require('controller/BlubbleController').BlubbleController(e.source.Blubble, e.source.Controller.SocketHelper);
			return require("ui/BlubbleWindow").BlubbleWindow(blubbleController);			
			},
			{
				image:blubble.Image, 
				title:blubble.Name,
				color:'White',
				fontSize:12,
				height:80,
				width:80
			}
			);
		blubbleBtn.borderRadius = 40;
		blubbleBtn.Controller = blubblePadWindow.Controller;
		blubbleBtn.Blubble = blubble;
		return blubbleBtn;		
	};

	blubblePadWindow.addBlubbleButton = function(blubble){
		blubblePadWindow.blubbleGrid.addElements([blubblePadWindow.createBlubbleButton(blubble)]);
	};

	blubblePadWindow.addEventListener('open',function(e){
		var blubbleBtns = [];
		if(e.source.Controller.Blubbles != null){
			for(var i=0; i<e.source.Controller.Blubbles.length; i++){
				blubbleBtns.push(blubblePadWindow.createBlubbleButton(e.source.Controller.Blubbles[i]));
			};			
		}
		
		var grid = require("ui/common/GridLayout").GridLayout(3,3,5,blubbleBtns,80);
		grid.top = 0;
		e.source.add(grid);
		e.source.blubbleGrid = grid;
		
		e.source.Controller.subscribe();
	});
	
	blubblePadController.BlubblePadWindow = blubblePadWindow; 
	
	return blubblePadWindow;
};
