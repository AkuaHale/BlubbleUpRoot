var Constants = require('Constants');
var Message = require('service/Message');
var BlubbleMessage = require('service/BlubbleMessage');
var BlubbleKey = require('service/BlubbleKey');
var BlubbleAction = require('service/BlubbleAction');
var PeerRegistry = require('service/PeerRegistry');
var ReactorRegistry = require('service/ReactorRegistry');
var BlubblePeer = require('data/BlubblePeer');

var connectedCallback = function(peer_){
	Ti.API.info('Connected:'+JSON.stringify(peer_.IPAddress));	
	var blubble = Alloy.Globals.loggedInBlubble;	
	var blubbleKey = new BlubbleKey(blubble.Name);
	var blubbleAction = new BlubbleAction(BlubbleAction.prototype.SUBSCRIBE_ACTION);
	var blubbleMessage = new BlubbleMessage(blubbleKey, blubbleAction, {SourceAddress:blubble.IPAddress});
	TCPPeerManager.prototype.Publish(peer_, new Message(Constants.prototype.BLUBBLE_MESSAGE,{
			BlubbleMessage:blubbleMessage
		}));
		
};

function TCPPeerManager(loggedInblubble_){
	this.LoggedInBlubble = loggedInblubble_;
			
	var acceptedCallback = function(e){
		Ti.API.info('Handling Accept...');
		var socket = e.inbound;	
		var connectedPeer = PeerRegistry.prototype.GetPeerByAddress(socket.host);
		if (connectedPeer == null) {
			Ti.API.info("Attempted connection from socket not on discovered list: "+socket.host);
			socket.close();
		}
		 else {
			Ti.API.info("Accepted connection from: "+socket.host);
			connectedPeer.Status = "Connected";
			connectedPeer.Socket = socket;
			PeerRegistry.prototype.AddPeer(connectedPeer);
			for(key in connectedPeer){
				Ti.API.info('Key:'+key);
			}
			Ti.Stream.pump(connectedPeer.Socket, TCPPeerManager.prototype.ReadCallback, 1024, true);				
			connectedCallback(connectedPeer);
	    }
		ListeningTCPSocket.accept({
			read: function(e) {
				Ti.API.info('Received Data:'+JSON.stringify(e.source.host));
				if(_msgRcvd != null){
					_msgRcvd(e);
					};
					// Do something with data
				},
			error: function(e) {
				Ti.API.info('TCP Error:'+JSON.stringify(e.source.host));
				// Do something with error
				}
		});	
	};
		
	Ti.API.info('Listening on socket host:'+this.LoggedInBlubble.IPAddress+' port:'+this.LoggedInBlubble.Port);
	var ListeningTCPSocket = Titanium.Network.Socket.createTCP({
		host:this.LoggedInBlubble.IPAddress,
		port:this.LoggedInBlubble.Port,
		listenQueueSize:10,	
		error:function(e) {
			Ti.API.info("Listener error: "+e.errorCode);
			Ti.API.info("CONNECTION has been closed: "+e.socket.host+":"+e.socket.port);
		},
		accepted:acceptedCallback
	});
	ListeningTCPSocket.Key ='Listening:'+this.LoggedInBlubble.BlubbleName+':'+this.LoggedInBlubble.IPAddress;
	ListeningTCPSocket.listen();		
};

TCPPeerManager.prototype.ConnectToPeer = function(peer_){
	Ti.API.info('Connecting to peer:'+JSON.stringify(peer_));
	var connectedPeer = PeerRegistry.prototype.GetPeerByAddress(peer_.IPAddress);
	if(connectedPeer == null){
		PeerRegistry.prototype.AddPeer(peer_);		
	} 
	if(peer_.Status == "AwaitingConnect"){
		var connectingSocket = Ti.Network.Socket.createTCP({
			host: peer_.IPAddress, 
		    port: peer_.Port,
		    connected: function (e) {
		    	Ti.API.info('Handling Connect...');
		    	var socket = e.socket;
				var connectedPeer = PeerRegistry.prototype.GetPeerByAddress(socket.host);
				if (connectedPeer == null) {
					Ti.API.info("Attempted connection from socket not on discovered list: "+socket.host);
					socket.close();
				}
				 else {
					Ti.API.info("Accepted connection from: "+socket.host);
					connectedPeer.Status = "Connected";
					connectedPeer.Socket = socket;
					Ti.Stream.pump(connectedPeer.Socket, TCPPeerManager.prototype.ReadCallback, 1024, true);
					PeerRegistry.prototype.AddPeer(connectedPeer);						
					connectedCallback(connectedPeer);
				}
				},
		        error: function (e) {
			        Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
			    }				
		    });
		    connectingSocket.Key = 'Connecting:'+this.LoggedInBlubble.BlubbleName+':'+this.LoggedInBlubble.IPAddress;
		    connectingSocket.connect();	
		}
 }; 

var receivedDataCallback = function(msg_){
	Ti.API.info('Message Received:'+JSON.stringify(msg_));
	var reactor = ReactorRegistry.prototype.Get(msg_.Key);
	if(reactor != null){
		reactor.Process(msg_);
	}
	else{
		Ti.API.info('No reactor for message:'+JSON.stringify(msg_));
	}
};

TCPPeerManager.prototype.Publish = function(peer_, message_){
	Ti.API.info('Publishing to '+JSON.stringify(peer_.IPAddress));
	Ti.API.info('Socket '+JSON.stringify(peer_.Socket));
    peer_.Socket.write(Ti.createBuffer({
        value : "#START#"
    }));						
    peer_.Socket.write(Ti.createBuffer({
        value : JSON.stringify(message_)
    }));			
    peer_.Socket.write(Ti.createBuffer({
        value : "#END#"
    }));								
};

TCPPeerManager.prototype.ReadCallback = function(e){

	var receivedDataCallback = function(msg_){
		Ti.API.info('Message Received:'+JSON.stringify(msg_));
		var reactor = ReactorRegistry.prototype.Get(msg_.Key);
		if(reactor != null){
			reactor.Process(msg_);
		}
		else{
			Ti.API.info('No reactor for message:'+JSON.stringify(msg_));
		}
	};

    if (e.bytesProcessed == -1)
    {
        // Error / EOF on socket. Do any cleanup here.
    }
    try {
        if(e.buffer) {
            var received = e.buffer.toString();
            var startIdx = received.indexOf("#START#");            
            if(startIdx > -1){
            	received = received.substring(startIdx+7, received.length);
            }
            var endIdx = received.indexOf("#END#");
            if(endIdx > -1){
            	received = received.substring(0, endIdx);
            }
            
            if(startIdx > -1){
            	this.CurrentData = '';
            }
			this.CurrentData += received;
            if(endIdx > -1){
	    		Ti.API.info('Final Data received.');
	            var rcvdMsg = JSON.parse(this.CurrentData.replace(/\\"/g, '"'));
	            if(receivedDataCallback != null){
	            	receivedDataCallback(rcvdMsg);
	            }	 
	            else{
	            	Ti.API.info('No Received Data Callback!!!');
	            }           	
            }
        } else {
            Ti.API.error('Error: read callback called with no buffer!');
        }
    } catch (ex) {
        Ti.API.error(ex);
    }
};	    

module.exports = TCPPeerManager;