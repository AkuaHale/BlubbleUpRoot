/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
 * A starting point for tab-based application with multiple top-level windows.
 * Requires Titanium Mobile SDK 1.8.0+.
 *
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *
 */

//bootstrap and check dependencies
if (Ti.version < 1.8) {
  alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
  //determine platform and form factor and render approproate components
  var osname = Ti.Platform.osname,
    version = Ti.Platform.version,
    height = Ti.Platform.displayCaps.platformHeight,
    width = Ti.Platform.displayCaps.platformWidth;

  function checkTablet() {
    var platform = Ti.Platform.osname;

    switch (platform) {
      case 'ipad':
        return true;
      case 'android':
        var psc = Ti.Platform.Android.physicalSizeCategory;
        var tiAndroid = Ti.Platform.Android;
        return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
      default:
        return Math.min(
          Ti.Platform.displayCaps.platformHeight,
          Ti.Platform.displayCaps.platformWidth
        ) >= 400
    }
  }

  var isTablet = checkTablet();

  var Window;
  if (isTablet) {
    Window = require('ui/tablet/ApplicationWindow');
  } else {
    Window = require('ui/handheld/ApplicationWindow');
  }

  var loginController = require('controller/LoginController').LoginController();
  var PhotoPad = require('data/PhotoPad/PhotoPad');
  var MusicPad = require('data/MusicPad/MusicPad');
  var VideoPad = require('data/VideoPad/VideoPad');
  var GamePad = require('data/GamePad/GamePad');
  var DevicePad = require('data/DevicePad/DevicePad');

  Ti.App.addEventListener(loginController.LOGIN_EVENT,function(evtData){
  	var Blubble = require('data/Blubble');
  	var blubble = new Blubble(1, evtData.UserName, evtData.UserName, '', [
  	new PhotoPad(blubble,'images/photos.png',[]),
  	new MusicPad(blubble,'images/music.png', []),
  	new VideoPad(blubble,'images/movies.png', []),
  	new GamePad(blubble,'images/games.png',[]),
  	new DevicePad(blubble, 'images/printer.png', [])
  	]);   
  	blubble.IsRemote = false;	
  	var blubbleUpWindow = require('ui/BlubbleUpWindow').BlubbleUpWindow(blubble);
  	blubbleUpWindow.open();
  	});	

  var loginWindow = require('ui/LoginWindow').LoginWindow(loginController);
  loginWindow.open();

})();
