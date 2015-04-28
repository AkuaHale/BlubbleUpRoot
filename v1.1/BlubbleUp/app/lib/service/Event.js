function Event(key_, args_){
	this.Key = key_;
	this.Args = args_;
}

Event.prototype.Key = {};
Event.prototype.Args = {};

module.exports = Event;