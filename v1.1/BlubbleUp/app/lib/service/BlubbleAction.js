function BlubbleAction(action_){
	this.Value = action_;
}

BlubbleAction.prototype.SUBSCRIBE_ACTION = 'SUBSCRIBE_ACTION'; 
BlubbleAction.prototype.UNSUBSCRIBE_ACTION = 'UNSUBSCRIBE_ACTION';
BlubbleAction.prototype.ADD_ACTION = 'ADD_ACTION';
BlubbleAction.prototype.UPDATE_ACTION = 'UPDATE_ACTION';
BlubbleAction.prototype.DELETE_ACTION = 'DELETE_ACTION'; 

module.exports = BlubbleAction;

