function MockNetworkDatahelper(blubbleName, appDataHelper){
	this.blubbleName = blubbleName;

	this.getFile = function(filePath){
		return appDataHelper.getFile(this.blubbleName+'/'+filePath);		
	};

	this.fileExists = function(filePath){
		return appDataHelper.fileExists(this.blubbleName+'/'+filePath);
	};

	this.createDirectory = function(dirName){
		return appDataHelper.createDirectory(this.blubbleName+'/'+dirName);
	};
	
	this.saveFile = function(dirName, fileName, fileData){
		return appDataHelper.saveFile(this.blubbleName+'/'+dirName, fileName, fileData);
	};	

	this.saveImageFromURL = function(dirName, fileName, url){
		return appDataHelper.saveImageFromURL(this.blubbleName+'/'+dirName, fileName, url);
	};	
};

module.exports = MockNetworkDatahelper;