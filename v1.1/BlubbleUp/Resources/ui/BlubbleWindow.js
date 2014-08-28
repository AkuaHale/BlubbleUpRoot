exports.BlubbleWindow = function(blubbleController) {
	var blubbleWindow = require("ui/common/controls").CustomTitleWindow(blubbleController.Blubble.Name);
	blubbleWindow.Controller = blubbleController;

	Ti.App.addEventListener(blubbleController.BLUBBLE_PAD_ADDED_EVENT,function(evtData){
		if(evtData.BlubbleName == blubbleController.Blubble.Name){
			blubbleController.BlubbleWindow.addPadButton(evtData.PadController);   			
		}
	});	
	
	blubbleWindow.createPadButton = function(padController){
		var padBtn = require("ui/common/controls").ChildWindowButton(blubbleWindow.containingTab, function(e){
			return padController.getWindow();			
			},
			{
				image:padController.Image
			}
			);
		padBtn.Controller = padController;
		return padBtn;		
	};
	
	blubbleWindow.addPadButton = function(padController){
		blubbleWindow.padGrid.addElements([blubbleWindow.createPadButton(padController)]);
	};

	blubbleWindow.addEventListener('open',function(e){
		var objArrays = []; // Array to place your Buttons/UI View
		// Create your Buttons / UI View
		for(var i=0; i<blubbleController.Controllers.length; i++){
			objArrays.push(blubbleWindow.createPadButton(blubbleController.Controllers[i]));			
		}

		var grid = require("ui/common/GridLayout").GridLayout(4,4,5,objArrays,80);
		grid.top = 0;
		e.source.add(grid);
		e.source.padGrid = grid;	
		
		e.source.Controller.Subscribe();
	});	
	
	blubbleWindow.addEventListener('close',function(e){
		e.source.Controller.Unsubscribe();
	});
	
	blubbleController.BlubbleWindow = blubbleWindow; 

	return blubbleWindow;
};
