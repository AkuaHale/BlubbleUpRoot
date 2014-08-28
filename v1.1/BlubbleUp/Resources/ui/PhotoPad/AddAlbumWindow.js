exports.AddAlbumWindow = function(photoPadController){
	
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);	

	var addAlbumWindow = require("ui/common/controls").CustomTitlePopUp('New Album',{
	});
	
	addAlbumWindow.borderWidth = 8;
	addAlbumWindow.borderColor = '#999';
	addAlbumWindow.top = 150;
	addAlbumWindow.height = 150;
	addAlbumWindow.width = 300;
	addAlbumWindow.borderRadius=10;
	addAlbumWindow.opacity = 1;
	addAlbumWindow.transform = t;
	addAlbumWindow.layout = 'vertical';

	var body = Ti.UI.createView({height:Ti.UI.SIZE, 
		layout:'vertical', 
		center:0});
	var albumNameTextBox = Ti.UI.createTextField({hintText:'Album Name',
	center:0,
	top:10,
	borderColor:'black',
	backgroundColor:'white',
	height:25,
	width:'80%',
	textAlign:'center',
	font:{fontFamily:'Calibri',fontSize:14,fontWeight:'regular'}});
	body.add(albumNameTextBox);

	var btnView = Ti.UI.createView({width:Ti.UI.SIZE, 
		layout:'horizontal', 
		center:0});
	
	var okButton = addAlbumWindow.createCloseEnabledBtn(addAlbumWindow, 'Done', {width:80, top:10}, function(){
		okButton.PhotoPadController.addAlbum(albumNameTextBox.value);
	});
	okButton.PhotoPadController = photoPadController;
	btnView.add(okButton);
	
	var cancelButton = addAlbumWindow.createCloseEnabledBtn(addAlbumWindow, 'Cancel', {width:80, top:10, left:10});
	btnView.add(cancelButton);
	
	body.add(btnView);
		
	addAlbumWindow.add(body);
			
	return addAlbumWindow;
};
