exports.DevicePadController = function(blubble) {
  var devicePadController = {Name:'Devices',
  Image:'images/printer.png'};
  
	devicePadController.getWindow = function(){
		return require("ui/DevicePad/DevicePadWindow").DevicePadWindow(devicePadController);
	};
  
  return devicePadController;
};