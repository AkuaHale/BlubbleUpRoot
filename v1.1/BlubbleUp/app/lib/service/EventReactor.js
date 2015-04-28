function EventReactor(key_, reactFunc_){
	this.Key = key_;
	this.Process = reactFunc_;	
}

EventReactor.prototype.getKey = function(){
	return this.Key;
};

EventReactor.prototype.Process = function(){
	this.Process();
};

module.exports = EventReactor;