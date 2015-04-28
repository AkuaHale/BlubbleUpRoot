function MessageReactor(key_, reactFunc_){
	this.Key = key_;
	this.Process = reactFunc_;	
}

MessageReactor.prototype.getKey = function(){
	return this.Key;
};

MessageReactor.prototype.Process = function(message_){
	this.Process(message_);
};

module.exports = MessageReactor;