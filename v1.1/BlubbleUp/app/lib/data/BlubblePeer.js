function BlubblePeer(blubbleName_, ipAddress_, communicationPort_, status_){
	this.BlubbleName = blubbleName_;
	this.IPAddress = ipAddress_;
	this.Port=communicationPort_;
	this.Status=status_;
	this.Socket={};
	this.CurrentData='';
}

module.exports = BlubblePeer;