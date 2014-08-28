exports.PhotoPadController = function(blubble, dataHelper){
	var photoPadController = {Name:'Photos',
	Image:'images/photos.png'};

	photoPadController.getWindow = function(){
		return require("ui/PhotoPad/PhotoPadWindow").PhotoPadWindow(photoPadController);
	};

	photoPadController.Albums = [];
	photoPadController.ALBUM_ADDED_EVENT = 'ALBUM_ADDED_EVENT';
	photoPadController.ALBUM_UPDATED_EVENT = 'ALBUM_UPDATED_EVENT';
	photoPadController.ALBUM_DELETED_EVENT = 'ALBUM_DELETED_EVENT';
	photoPadController.PHOTO_ADDED_EVENT = 'PHOTO_ADDED_EVENT';
	photoPadController.PHOTO_UPDATED_EVENT = 'PHOTO_UPDATED_EVENT';
	photoPadController.PHOTO_DELETED_EVENT = 'PHOTO_DELETED_EVENT';

	var Photo = require('data/PhotoPad/Photo');
	var mockPhotos = [
		new Photo('http://www.lorempixel.com/600/600/'),
		new Photo('http://www.lorempixel.com/400/300/'),
		new Photo('http://www.lorempixel.com/410/300/'),
		new Photo('http://www.lorempixel.com/500/300/'),
		new Photo('http://www.lorempixel.com/300/300/'),
		new Photo('http://www.lorempixel.com/450/320/'),
		new Photo('http://www.lorempixel.com/500/400/')
	];
	

/*
	var AppDataHelper = require('util/ApplicationDataHelper');
	var dataHelper = new AppDataHelper();
*/ 

/*	
	appDataHelper.createDirectory('Albums');
	appDataHelper.saveImageFromURL('Albums/Sayre','pic1.png', 'http://www.lorempixel.com/400/300/');
	appDataHelper.saveImageFromURL('Albums/Sayre','pic2.png', 'http://www.lorempixel.com/410/300/');
	appDataHelper.saveImageFromURL('Albums/Sayre','pic3.png', 'http://www.lorempixel.com/500/300/');
	appDataHelper.saveImageFromURL('Albums/Sayre','pic4.png', 'http://www.lorempixel.com/300/300/');
	appDataHelper.saveImageFromURL('Albums/Sayre','pic5.png', 'http://www.lorempixel.com/700/600/');
	
	appDataHelper.saveImageFromURL('Albums/NYC','pic1.png', 'http://www.lorempixel.com/700/600/');
	appDataHelper.saveImageFromURL('Albums/NYC','pic2.png', 'http://www.lorempixel.com/400/300/');
	appDataHelper.saveImageFromURL('Albums/NYC','pic3.png', 'http://www.lorempixel.com/410/300/');
	appDataHelper.saveImageFromURL('Albums/NYC','pic4.png', 'http://www.lorempixel.com/500/300/');
	appDataHelper.saveImageFromURL('Albums/NYC','pic5.png', 'http://www.lorempixel.com/300/300/');
	appDataHelper.saveImageFromURL('Albums/NYC','pic6.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Yellowstone','pic1.png', 'http://www.lorempixel.com/410/300/');
	appDataHelper.saveImageFromURL('Albums/Yellowstone','pic2.png', 'http://www.lorempixel.com/500/300/');
	appDataHelper.saveImageFromURL('Albums/Yellowstone','pic3.png', 'http://www.lorempixel.com/300/300/');
	appDataHelper.saveImageFromURL('Albums/Yellowstone','pic4.png', 'http://www.lorempixel.com/700/600/');
	appDataHelper.saveImageFromURL('Albums/Yellowstone','pic5.png', 'http://www.lorempixel.com/500/400/');
	
	appDataHelper.saveImageFromURL('Albums/Glacier_National','pic1.png', 'http://www.lorempixel.com/400/300/');
	appDataHelper.saveImageFromURL('Albums/Glacier_National','pic2.png', 'http://www.lorempixel.com/410/300/');
	appDataHelper.saveImageFromURL('Albums/Glacier_National','pic3.png', 'http://www.lorempixel.com/500/300/');
	appDataHelper.saveImageFromURL('Albums/Glacier_National','pic4.png', 'http://www.lorempixel.com/300/300/');
	appDataHelper.saveImageFromURL('Albums/Glacier_National','pic5.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Rocky_Mountain','pic1.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Lake_George','pic1.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Diwali','pic1.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Washington','pic1.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Vermont','pic1.png', 'http://www.lorempixel.com/700/600/');

	appDataHelper.saveImageFromURL('Albums/Niagara','pic1.png', 'http://www.lorempixel.com/700/600/');
*/	
	var Album = require('data/PhotoPad/Album');
	
	var albumsDir = dataHelper.getFile('Albums');
	var dirs = albumsDir.getDirectoryListing();
	if(dirs != null){
		for(var i=0; i<dirs.length; i++){
			var dirName = 'Albums'+'/'+dirs[i];
			var dir = dataHelper.getFile(dirName);
			var pics = dir.getDirectoryListing();
			var picArr = [];
			for(var j=0; j<pics.length; j++){
				var pic = dataHelper.getFile(dirName+'/'+pics[j]);
				picArr.push(new Photo(pic));
			}
			var albumIcon = 'images/photos.png';
			if(picArr.length > 0){
				albumIcon = picArr[0].Image;
			}
			photoPadController.Albums.push(new Album({},dirs[i],albumIcon,picArr));
		}		
	}
	
	photoPadController.addAlbum = function(albumName){
		var albumPath = 'Albums'+'/'+albumName;
		if(!dataHelper.fileExists(albumPath)){
			dataHelper.createFolder(albumPath);
			var newAlbum = new Album({},albumName,'images/photos.png',[]);	
			photoPadController.Albums.push(newAlbum);
			var evtData = {
				Album : newAlbum
			};
			Ti.App.fireEvent(photoPadController.ALBUM_ADDED_EVENT, evtData);				
		}
	};
	
	photoPadController.addPhotos = function(album, photos){	
		var albumPath = 'Albums'+'/'+album.Name;
		var albumOrigCount = album.Photos.length;
		var newPhotos = [];
		if(photos != null){
			for(var i=0; i<photos.length; i++){
				var f = dataHelper.saveFile(albumPath,'photo_'+albumOrigCount+i+'.png',photos[i]);
				newPhotos.push(new Photo(f.nativePath));
			}
			var evtData = {
				Album : album,
				NewPhotos : newPhotos
			};
			Ti.App.fireEvent(photoPadController.PHOTO_ADDED_EVENT, evtData);				
		}				
	};

	return photoPadController;
};
