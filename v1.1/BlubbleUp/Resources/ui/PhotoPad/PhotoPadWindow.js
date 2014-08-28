exports.PhotoPadWindow = function(photoPadController) {	
	var photoPadWindow = require("ui/common/controls").CustomTitleWindow(photoPadController.Name);
	photoPadWindow.Controller = photoPadController;

	Ti.App.addEventListener(photoPadController.ALBUM_ADDED_EVENT,function(evtData){
		photoPadController.PhotoPadWindow.addAlbumButton(evtData.Album);   
	});	
	
	photoPadWindow.createAlbumButton = function(album){
		var albumBtn = require("ui/common/controls").ChildWindowButton(photoPadWindow.containingTab, function(e){
			return require("ui/PhotoPad/PhotosWindow").PhotosWindow(e.source.Controller, e.source.Album);			
			},
			{
				image:album.Image, 
				title:album.Name,
				color:'White',
				fontSize:12
			}
			);
		albumBtn.Controller = photoPadWindow.Controller;
		albumBtn.Album = album;
		return albumBtn;		
	};

	photoPadWindow.addAlbumButton = function(album){
		photoPadWindow.albumGrid.addElements([photoPadWindow.createAlbumButton(album)]);
	};

	photoPadWindow.addEventListener('open',function(e){
		var albumBtns = [];
		for(var i=0; i<e.source.Controller.Albums.length; i++){
			albumBtns.push(photoPadWindow.createAlbumButton(e.source.Controller.Albums[i]));
		};
		
		var grid = require("ui/common/GridLayout").GridLayout(4,4,5,albumBtns,80);
		grid.top = 0;
		e.source.add(grid);
		e.source.albumGrid = grid;

		var addAlbumBtn = require("ui/common/controls").ChildPopUpButton(function(e){
			return require("ui/PhotoPad/AddAlbumWindow").AddAlbumWindow(e.source.Controller);						
		},
		{
			image:'images/plus-32.png'
		});
		addAlbumBtn.Controller = e.source.Controller;
		e.source.rightNavButton = addAlbumBtn;				
	});
	photoPadController.PhotoPadWindow = photoPadWindow; 
	
	return photoPadWindow;
};
