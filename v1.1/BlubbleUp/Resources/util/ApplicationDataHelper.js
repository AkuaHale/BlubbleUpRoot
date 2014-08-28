function ApplicationDataHelper(){

	this.getFile = function(filePath){
		return Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filePath);		
	};

	this.fileExists = function(filePath){
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filePath);
		return f.exists();		
	};

	this.createDirectory = function(dirName){
		var dir = Ti.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory()+'/'+dirName);
		if(!dir.exists()){
			dir.createDirectory();
		}		
		return dir;
	};
	
	this.saveFile = function(dirName, fileName, fileData){
		var dir = this.createDirectory(dirName);
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory+'/'+dirName+'/'+fileName);
		if(f.exists() == false){
			f.createFile();
		}
		f.write(fileData);
		return f;
	};	

	this.saveImageFromURL = function(dirName, fileName, url){
		var dir = this.createDirectory(dirName);
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory+'/'+dirName+'/'+fileName);
		if(f.exists() == false){
			f.createFile();
		}
		var isAndroid = ( 'android' == Ti.Platform.osname );
        var blob = Ti.UI.createImageView( { 
          image: url,
          height: 'auto',
          width: 'auto'
        } ).toImage();
        f.write( isAndroid ? blob.media : blob );
		return f;
	};	
};

module.exports = ApplicationDataHelper;