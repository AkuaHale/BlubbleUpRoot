exports.ChildWindowButton = function(parentTab,childWindowProxy, args){
	var btn = Ti.UI.createButton();
	btn.parentTab = parentTab;
	btn.childWindowProxy = childWindowProxy;
	btn.height = args.height || 60;
	btn.width = args.width || 60;
	
    var CreateThumb = function(image,size) {
//	if (OS_IOS){ 
	  var imageView = Ti.UI.createImageView({
	    image: image,
	    hires:true
	  });
	  return imageView.toImage().imageAsThumbnail(size * 2,0,0);
//	} 
//  	else{
//  		return image;
//  	}
	};
	
	var fgMainView = Ti.UI.createView({
	width:Ti.UI.FILL,
	height:Ti.UI.FILL,
	layout:'vertical',
	backgroundColor:'transparent',
	zIndex:0
	});
	btn.add(fgMainView);

	var fgThumb = Ti.UI.createView({
	backgroundColor:'transparent',
	layout:'vertical'
	});
	fgMainView.add(fgThumb);
	
	var fgImage = Ti.UI.createImageView({
	width:Ti.UI.SIZE,
	height:Ti.UI.SIZE
	});
	fgThumb.add(fgImage);

if(args.title != null){
	fgThumb.width = btn.width; //- thePadding;
	fgThumb.height = btn.height * 0.70;
	//fgThumb.top = thePadding / 2;
	
	fgImage.image = CreateThumb(args.image, btn.width);// - thePadding);
	fgImage.width = btn.width; //- thePadding;
	fgImage.height = btn.height * 0.70;
	
	var btnTitle = Ti.UI.createLabel({
		font:{fontFamily:args.fontFamily || 'Papyrus',
		fontSize:args.fontSize || 20,
		fontWeight:args.fontWeight || 'bold'},
		color: args.color || '#6a917c',
	    text: args.title || {}
	});
	fgMainView.add(btnTitle);
}
else{
	fgImage.image = CreateThumb(args.image, btn.width); //- thePadding);
	fgImage.width = btn.width;// - thePadding;
	fgImage.height = btn.height;// - thePadding;
	
	//fgThumb.top = thePadding / 2;
	fgThumb.width = btn.width;// - thePadding;
	fgThumb.height = btn.height;// - thePadding;
}

	
	btn.addEventListener('click', function(e){
		var childWindow = e.source.childWindowProxy(e);
		e.source.parentTab.open(childWindow);
		childWindow.containingTab = e.source.parentTab;
	});
	return btn;
};

exports.ChildPopUpButton = function(childWindowProxy, args){
	var image = args.image || {};
	
	var btn = Ti.UI.createButton({
		image : image
	});
	btn.childWindowProxy = childWindowProxy;
	
	btn.addEventListener('click', function(e){
		var childWindow = e.source.childWindowProxy(e);
		// create first transform to go beyond normal size
		var t1 = Titanium.UI.create2DMatrix();
		t1 = t1.scale(1.1);
		var a = Titanium.UI.createAnimation();
		a.transform = t1;
		a.duration = 200;
	
		// when this animation completes, scale to normal size
		a.addEventListener('complete', function()
		{
			Titanium.API.info('here in complete');
			var t2 = Titanium.UI.create2DMatrix();
			t2 = t2.scale(1.0);
			childWindow.animate({transform:t2, duration:200});
		});

		childWindow.open(a);
		});
	
	return btn;
};

exports.CustomTitleWindow = function(title, color, backgroundColor, fontFamily, font, fontSize, fontWeight){
	var windowTitle = Ti.UI.createLabel({
		font:{fontFamily:fontFamily || 'Papyrus',
		fontSize:fontSize || 20,
		fontWeight:fontWeight || 'bold'},
		color: color || '#6a917c',
	    text: title || {}
	});
		
	var self = Ti.UI.createWindow({
		titleControl: windowTitle,
		backgroundColor: backgroundColor || '#6a917c'
		});
	self.fullscreen = true;	 	
	return self;
};

exports.CustomTitlePopUp = function(title, args){
	args = args || {};
	var windowTitle = Ti.UI.createLabel({
		font:{fontFamily:args.fontFamily || 'Papyrus',
		fontSize:args.fontSize || 20,
		fontWeight:args.fontWeight || 'bold'},
		color: args.color || 'White',
	    text: title || {},
	    top: args.top || 10
	});
		
	var self = Ti.UI.createWindow({
		backgroundColor: args.backgroundColor || '#6a917c'
		});
	
	self.add(windowTitle);
	
	self.createCloseEnabledBtn = function(parentWindow, title, args, clickAction){
		var closeBtn = Ti.UI.createButton({title:title || {},
			center:args.center || 0,
			top:args.top || 0,
			right: args.right || 0,
			left: args.left || 0,
			bottom: args.bottom || 0,
			height:args.height || 25,
			width:args.width || 200,
			backgroundColor:args.backgroundColor || '#0b5401',
			color:args.color || 'white',
			borderRadius:args.borderRadius || 3,
			font:{fontFamily:args.fontFamily || 'Copperplate',
			fontSize:args.fontSize || 14,
			fontWeight:args.fontWeight || 'regular'}});		

		closeBtn.addEventListener('click', function(e){
			if(clickAction != null)
			{
				clickAction();				
			}
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			parentWindow.close({transform:t3,duration:300});
			});

		return closeBtn;
	};
	
	return self;
};
