function PeerRegistry(){
}

PeerRegistry.prototype.PeerDict = {};

PeerRegistry.prototype.AddPeer = function(peer_){
	Ti.API.info('Adding peer:'+JSON.stringify(peer_));
	PeerRegistry.prototype.PeerDict[peer_.IPAddress] = peer_;
};

PeerRegistry.prototype.GetPeerByAddress = function(ipAddress_){
	return PeerRegistry.prototype.PeerDict[ipAddress_];
};

PeerRegistry.prototype.GetPeerByName = function(name_){
	var retPeer = null;
	var peers = PeerRegistry.prototype.PeerDict;
	for(ipAddress in peers){
		var currentPeer = peers[ipAddress];
		if(currentPeer.BlubbleName == name_){
			retPeer = currentPeer;
			break; 
		}
	}
	return retPeer;
};

PeerRegistry.prototype.GetPeers = function(){
	var peers = [];
	var peerDict = PeerRegistry.prototype.PeerDict;
	for(ipAddress in peerDict){
		peers.push(peerDict[ipAddress]);
	}
	return peers;
};


module.exports = PeerRegistry;
