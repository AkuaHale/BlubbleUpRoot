var ImageManager = require('ImageManager');

var args = arguments[0] || {};
var currentWindow = $._settingsWindow;
var loggedInBlubble = Alloy.Globals.loggedInBlubble;

function addProfilePic(e){
    Titanium.Media.openPhotoGallery({
        success:function(event)
        {
            var image = event.media; 
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
            {
				var filename = Titanium.Filesystem.applicationDataDirectory+loggedInBlubble.Name+".png";
				f = Titanium.Filesystem.getFile(filename);
				f.write(ImageManager.prototype.ImageAsThumbnail(image, 200, 1, 100));
				Titanium.API.info(filename);
				$._profileImgView.Image = filename;
				loggedInBlubble.Image = filename;
				Ti.App.fireEvent('PROFILE_PIC_UPDATED', {ProfileImage:filename});
            }   
        },
        cancel:function()
        {
            //user cancelled the action fron within
            //the photo gallery
        }
    });
};