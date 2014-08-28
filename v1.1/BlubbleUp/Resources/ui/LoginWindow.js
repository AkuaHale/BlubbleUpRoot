exports.LoginWindow = function(loginController) {
	var loginWindow = require("ui/common/controls").CustomTitlePopUp('Blubble Up');
	
	loginWindow.layout = 'vertical';
	var body = Ti.UI.createView({height:Ti.UI.SIZE, 
		layout:'vertical', 
		center:0,
		top:150});
		
	var userNameTextBox = Ti.UI.createTextField({hintText:'User Name',
	center:0,
	top:10,
	borderColor:'black',
	backgroundColor:'white',
	height:25,
	width:'80%',
	textAlign:'center',
	font:{fontFamily:'Calibri',fontSize:14,fontWeight:'regular'}});
	body.add(userNameTextBox);

	var btnView = Ti.UI.createView({width:Ti.UI.SIZE, 
		layout:'horizontal', 
		center:0});
	
	var okButton = loginWindow.createCloseEnabledBtn(loginWindow, 'Login', {width:80, top:10}, function(){
		loginController.login(userNameTextBox.value);
	});
	
	btnView.add(okButton);
	
	body.add(btnView);
		
	loginWindow.add(body);
	return loginWindow;	
};