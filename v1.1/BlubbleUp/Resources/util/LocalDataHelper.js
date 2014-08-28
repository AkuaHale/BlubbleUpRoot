function LocalDataHelper(appDataHelper){

	this.getFile = function(filePath){
		return appDataHelper.getFile(filePath);		
	};

	this.fileExists = function(filePath){
		return appDataHelper.fileExists(filePath);
	};

	this.createFolder = function(dirName){
		return appDataHelper.createDirectory(dirName);
	};
	
	this.saveFile = function(dirName, fileName, fileData){
		return appDataHelper.saveFile(dirName, fileName, fileData);
	};	

	this.saveImageFromURL = function(dirName, fileName, url){
		return appDataHelper.saveImageFromURL(dirName, fileName, url);
	};	
};

module.exports = LocalDataHelper;