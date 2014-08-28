exports.PhotosWindow = function(photoPadController, album) {	
	var photosWindow = require("ui/common/controls").CustomTitleWindow(album.Name);
	
	photosWindow.Controller = photoPadController;
	photosWindow.Album = album;
	
	Ti.App.addEventListener(photoPadController.PHOTO_ADDED_EVENT,function(evtData){
		photoPadController.CurrentPhotosWindow.addPhotoButton(evtData.Album, evtData.NewPhotos);   
	});	

	photosWindow.createPhotoButton = function(photo){
		var photoBtn = require("ui/common/controls").ChildWindowButton(photosWindow.containingTab, function(e){	
			return require("ui/PhotoPad/PhotoWindow").PhotoWindow(e.source.Controller, e.source.Album, e.source.Photo);										
			},
			{
				image:photo.Image
			}
			);
		photoBtn.ContainingView = photosWindow;
		photoBtn.Controller = photosWindow.Controller;
		photoBtn.Album = photosWindow.Album;
		photoBtn.Photo = photo;
		return photoBtn;		
	};

	photosWindow.addPhotoButton = function(album, newPhotos){
		var photoBtns = [];
		for(var i=0; i<newPhotos.length; i++){
			photoBtns.push(photosWindow.createPhotoButton(newPhotos[i]));
		}
		photosWindow.photoGrid.addElements(photoBtns);
	};

	photosWindow.addEventListener('open',function(e){
		var photoBtns = [];
		for(var i=0; i<e.source.Album.Photos.length; i++){
			photoBtns.push(photosWindow.createPhotoButton(e.source.Album.Photos[i]));			
		};
		
		var grid = require("ui/common/GridLayout").GridLayout(4,4,5,photoBtns,80);
		grid.top = 0;		
		e.source.add(grid);	
		e.source.photoGrid = grid;	

		var addPhotoBtn = require("ui/common/controls").ChildPopUpButton(function(e){
			return require("ui/PhotoPad/AddPhotosWindow").AddPhotosWindow(e.source.Controller, e.source.Album);						
		},
		{
			image:'images/plus-32.png'
		});
		addPhotoBtn.Controller = e.source.Controller;
		addPhotoBtn.Album = e.source.Album;
		e.source.rightNavButton = addPhotoBtn;
	});
	photoPadController.CurrentPhotosWindow = photosWindow;
	return photosWindow;
};
