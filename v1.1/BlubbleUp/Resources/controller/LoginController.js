exports.LoginController = function(){
	var loginController = {Name:'Login'};	
	loginController.CurrentUser = {};
	
	loginController.LOGIN_EVENT = 'LOGIN_EVENT';
	loginController.LOGOFF_EVENT = 'LOGOFF_EVENT';
	
	loginController.login = function(userName){
		loginController.CurrentUser = userName;
		var evtData = {
			UserName : userName
		};
		Ti.App.fireEvent(loginController.LOGIN_EVENT, evtData);				
	};
	
	loginController.logoff = function(userName){
		var evtData = {
		};
		Ti.App.fireEvent(loginController.LOGOFF_EVENT, evtData);						
	};

	return loginController;	
};