function Message(key_, args_){
	this.Key = key_;
	this.Args = args_;	
}

Message.prototype.Key = {};
Message.prototype.Args = {};

module.exports = Message;