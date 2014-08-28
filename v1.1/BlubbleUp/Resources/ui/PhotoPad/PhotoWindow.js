exports.PhotoWindow = function(photoPadController, album, photo) {	
	var photoWindow = require("ui/common/controls").CustomTitleWindow('Test');
	
	photoWindow.Controller = photoPadController;
	photoWindow.Album = album;
	photoWindow.Photo = photo;
	photoWindow.addEventListener('open',function(e){
		var url = e.source.Photo.Image;		
		var topView = Ti.UI.createView({
			width:Ti.UI.FILL,
			height: Ti.UI.FILL
		});
	
		var imgView = Ti.UI.createImageView({
			image: url,
			width:Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		
		topView.add(imgView);
		topView.top = 0;
		e.source.add(topView);		
	});
	return photoWindow;
};
