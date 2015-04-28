var Constants = require('Constants');
var Pad = require('data/Pad');
var BlubbleManager = require('service/BlubbleManager');
var ReactorRegistry = require('service/ReactorRegistry');

var args = arguments[0] || {};

Alloy.Globals.tabGroup = $._mainTabGroup;
Alloy.Globals.loggedInBlubble = args.loggedInBlubble;
ReactorRegistry.prototype.Initialize();
var blubbleManager = new BlubbleManager(args.loggedInBlubble);
blubbleManager.DiscoverBlubbles();
Alloy.Globals.blubbleManager = blubbleManager;

var loggedInBlubble = Alloy.Globals.loggedInBlubble;
var homeWin = Alloy.createController('BlubbleUpWindow', {}).getView();
var homeTab = Ti.UI.createTab({
title: loggedInBlubble.Name,
icon: '/images/home-32.png',
window: homeWin
});	
$._mainTabGroup.addTab(homeTab);

var blubblesWin = Alloy.createController('BlubblePadWindow', {blubble:loggedInBlubble, pad:new Pad('Blubbles','/images/groups-32.png',[],false)}).getView();
var blubblesTab = Ti.UI.createTab({
title: 'Blubbles',
icon: '/images/groups-32.png',
window: blubblesWin
});	
$._mainTabGroup.addTab(blubblesTab);

var settingsWin = Alloy.createController('SettingsWindow', {}).getView();
var settingsTab = Ti.UI.createTab({
title: 'Settings',
icon: '/images/home-32.png',
window: settingsWin
});	
$._mainTabGroup.addTab(settingsTab);