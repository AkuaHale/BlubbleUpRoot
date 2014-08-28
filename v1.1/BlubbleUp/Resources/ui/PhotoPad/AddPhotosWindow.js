exports.AddPhotosWindow = function(photoPadController, album){
	
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);	

	var addPhotosWindow = require("ui/common/controls").CustomTitlePopUp('Add Photo',{
	});
	
	addPhotosWindow.borderWidth = 8;
	addPhotosWindow.borderColor = '#999';
	addPhotosWindow.top = 150;
	addPhotosWindow.height = 180;
	addPhotosWindow.width = 300;
	addPhotosWindow.borderRadius=10;
	addPhotosWindow.opacity = 1;
	addPhotosWindow.transform = t;
	addPhotosWindow.layout = 'vertical';

	var body = Ti.UI.createView({height:Ti.UI.SIZE, 
		layout:'vertical', 
		center:0});

	var btnView = Ti.UI.createView({width:Ti.UI.SIZE, 
		layout:'vertical', 
		center:0});
	
	var cameraButton = addPhotosWindow.createCloseEnabledBtn(addPhotosWindow, 'Camera', {width:80, top:10}, function(){
		cameraButton.PhotoPadController.addAlbum(albumNameTextBox.value);
	});
	cameraButton.PhotoPadController = photoPadController;
	btnView.add(cameraButton);
	
	var galleryButton = addPhotosWindow.createCloseEnabledBtn(addPhotosWindow, 'Gallery', {width:80, top:10}, function(){
		        Titanium.Media.openPhotoGallery({
		            success:function(event)
		            {
		                //getting media
		                var image = event.media; 
		                // set image view
		              
		                //checking if it is photo
		                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
		                {
		                    //we may create image view with contents from image variable
		                    //or simply save path to image
		                    //Ti.App.Properties.setString("image", image.nativePath);
		                    var photoArr = [
		                    	image
		                    ];		
		                    galleryButton.PhotoPadController.addPhotos(galleryButton.Album, photoArr);		
		                }   
		            },
		            cancel:function()
		            {
		                //user cancelled the action fron within
		                //the photo gallery
		            }
		        });
	});
	galleryButton.PhotoPadController = photoPadController;
	galleryButton.Album = album;
	btnView.add(galleryButton);

	var cancelButton = addPhotosWindow.createCloseEnabledBtn(addPhotosWindow, 'Cancel', {width:80, top:10});
	btnView.add(cancelButton);
	
	body.add(btnView);
		
	addPhotosWindow.add(body);
			
	return addPhotosWindow;
};
