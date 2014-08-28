exports.PadController = function(blubble, pad) {
  var padController = {Name:pad.Name,
  Image:pad.Image};
  
  var padWindowProxy;
  switch(pad.Name){
  	
  }

	padController.getWindow = function(){
		return padWindowProxy(padController);
	};

  return padController;
};