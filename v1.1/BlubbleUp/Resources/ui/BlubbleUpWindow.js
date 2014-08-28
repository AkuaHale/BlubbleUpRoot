exports.BlubbleUpWindow = function(loggedInBlubble) {

  var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
  var blubbleUpWindow = new ApplicationTabGroup();
  
  var blubbleController = require('controller/BlubbleController').BlubbleController(loggedInBlubble);
  
  var blubbleWindow = require('ui/BlubbleWindow').BlubbleWindow(blubbleController);
  var tab1 = Ti.UI.createTab({
  	title: blubbleWindow.title,
	icon: '/images/home-32.png',
	window: blubbleWindow
  });	
  blubbleWindow.containingTab = tab1;
  blubbleUpWindow.addTab(tab1);
  
  var blubblePadController = require('controller/BlubblePadController').BlubblePadController();
  var blubblePadWindow = require('ui/BlubblePadWindow').BlubblePadWindow(blubblePadController);
  blubbleUpWindow.Controller = blubblePadController;
  var tab2 = Ti.UI.createTab({
  	title: blubblePadController.Name,
	icon: blubblePadController.Image,
	window: blubblePadWindow
  });	
  blubblePadWindow.containingTab = tab2;  
  blubbleUpWindow.addTab(tab2);

  var chatWindow = require('ui/ChatWindow').ChatWindow('Blubble Chat');
  var tab3 = Ti.UI.createTab({
  	title: chatWindow.title,
	icon: '/images/chat-32.png',
	window: chatWindow
  });	
  chatWindow.containingTab = tab3;
  blubbleUpWindow.addTab(tab3);
  
  var settingsWindow = require('ui/SettingsWindow').SettingsWindow('Settings');
  var tab4 = Ti.UI.createTab({
  	title: settingsWindow.title,
	icon: '/images/settings-32.png',
	window: settingsWindow
  });	
  settingsWindow.containingTab = tab4;
  blubbleUpWindow.addTab(tab4);
  
  return blubbleUpWindow;
};