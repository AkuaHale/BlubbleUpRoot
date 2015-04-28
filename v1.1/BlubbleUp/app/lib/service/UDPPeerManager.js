var UDP = require('ti.udp');
var BlubblePeer = require('data/BlubblePeer');

var _port;
var _socket;
var _discoveredPeers;
var SendString;
var DiscoverPayLoad;

exports.DISCOVERED_EVENT = 'DISCOVERED_EVENT';
exports.CONNECT_EVENT = 'CONNECT_EVENT';
exports.DISCONNECT_EVENT = 'DISCONNECT_EVENT';

function UDPPeerManager(port_){
	this.DISCOVERED_EVENT = exports.DISCOVERED_EVENT;
	this.CONNECT_EVENT = exports.CONNECT_EVENT;
	this.DISCONNECT_EVENT = exports.DISCONNECT_EVENT;

	_discoveredPeers = [];
	_port = port_;
	_socket = UDP.createSocket();	
	if(_port != null)
	{
		_socket.start({
		    port: _port
		});		
	}	
	
	SendString = function(payload_, targetHost_){
	var data = JSON.stringify(payload_);
	Ti.API.info('Sending Payload:' + data);
	if(targetHost_ != null){
		if(targetHost_ == Titanium.Platform.address){
			Ti.API.info('Ignoring Send Request as it is the local machine...');			
		}
		else{
			Ti.API.info('Sending to host:'+targetHost_+' port:'+_port);
			_socket.sendString({
				host: targetHost_,
	        	data: data
	        });  			
		}
	}
	else{
		Ti.API.info('Broadcasting Payload');
		_socket.sendString({
        	data: data
        });        			
	}	
	Ti.API.info('Send Successfull!!!');
};

	this.DiscoverPeers = function(discoverPayLoad_){
		DiscoverPayLoad = discoverPayLoad_;
		Ti.API.info('Discovering Peers...');
		_socket.addEventListener('data', function(evt) {
			Titanium.API.info('Received data: '+evt.stringData);		
			var payload = JSON.parse(evt.stringData.replace(/\\"/g, '"'));	
			Titanium.API.info('Received payload: '+payload);
			var newBlubblePeer = new BlubblePeer(payload.DiscoverPayLoad.BlubbleName,payload.DiscoverPayLoad.IPAddress,payload.DiscoverPayLoad.CommunicationPort);
			
			if(payload.Action == "CONNECT"){
				newBlubblePeer.Status = "AwaitingConnect";
				Ti.App.fireEvent(exports.CONNECT_EVENT,{Peer:newBlubblePeer});		
				Titanium.API.info('Raised event:'+ exports.CONNECT_EVENT);			
			}
			else{
				var discovered = false;
				if(payload.Action == "DISCOVER" || payload.Action == "ACK"){
					for(var i=0; i< _discoveredPeers.length; i++){
						if(_discoveredPeers[i].IPAddress==newBlubblePeer.IPAddress){
							discovered = true;
							break;
						}
					}
				}
				
				if(!discovered){
					if(newBlubblePeer.IPAddress != Titanium.Platform.address){
						_discoveredPeers.push(newBlubblePeer);
						Ti.App.fireEvent(exports.DISCOVERED_EVENT,{Peer:newBlubblePeer});	
						Titanium.API.info('Raised event:'+ exports.DISCOVERED_EVENT);
		
						Ti.API.info('Sending Ack to '+newBlubblePeer.IPAddress);
						SendString({Action:'ACK', DiscoverPayLoad:DiscoverPayLoad}, newBlubblePeer.IPAddress);	
					}
				}
				else{
					Ti.API.info('Sending Connect to '+payload.DiscoverPayLoad.IPAddress);
					SendString({Action:'CONNECT', DiscoverPayLoad:DiscoverPayLoad}, payload.DiscoverPayLoad.IPAddress);					
				}				
			}			
		});
		
		SendString({Action:'DISCOVER', DiscoverPayLoad:DiscoverPayLoad});	
	};
	
	this.GetPeers = function(){
		return _discoveredPeers;
	};

};

module.exports = UDPPeerManager;


