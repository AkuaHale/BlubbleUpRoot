var Pad = require('data/Pad');
var Blubble = require('data/Blubble');

var args = arguments[0] || {};

function login(e){
	Ti.API.info(JSON.stringify($._blubbleNameTxtField));
	var blubbleName = $._blubbleNameTxtField.getValue();
	var loggedInBlubble = new Blubble(blubbleName, blubbleName, blubbleName, null, [
		new Pad('Photos','/images/photos.png',[],true),
		new Pad('Music','/images/music.png',[],true),
		new Pad('Video','/images/movies.png',[],true),
		new Pad('Games','/images/games.png',[],true),	
		new Pad('Devices','/images/printer.png',[],false)		
	], false);
	Ti.API.info('Logged In Blubble:'+JSON.stringify(loggedInBlubble));
	var mainWin = Alloy.createController('Main', {loggedInBlubble:loggedInBlubble}).getView();
	mainWin.open();
};