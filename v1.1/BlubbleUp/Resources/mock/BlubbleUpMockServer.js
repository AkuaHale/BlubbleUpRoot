var io = require('socket.io').listen(8080);
var Blubble = require('../data/Blubble');
var PhotoPad = require('../data/PhotoPad/PhotoPad');
var MusicPad = require('../data/MusicPad/MusicPad');
var VideoPad = require('../data/VideoPad/VideoPad');
var GamePad = require('../data/GamePad/GamePad');
var DevicePad = require('../data/DevicePad/DevicePad');

var blubbleUpChannel = io.of('/blubbleUp');

var lastJoinedBlubbleName;

blubbleUpChannel.on('connection', function(socket){
  console.log('connected: %s', socket.id);

  socket.on('blubble:subscribe', function(value){
    console.log('%s joining to channel: %s', socket.id, value.channelId);
    lastJoinedBlubbleName = value.channelId;
    socket.join(value.channelId);
    socket.set('channel_id', value.channelId, function(){
    });
  });

  socket.on('blubble:unsubscribe', function(){
    console.log('%s unsubscribing', socket.id);
    socket.get('channel_id', function(channelId){
      //console.log('%s leaving channel: %s', socket.id, channelId);		
      //socket.leave(channelId);
      console.log('%s leaving channel: %s', socket.id, lastJoinedBlubbleName);		
      socket.leave(lastJoinedBlubbleName);
    });
  });

  socket.on('disconnect', function(){
    console.log('%s disconnected', socket.id);
    socket.get('channel_id', function(channelId){
    	console.log('=========================================================================');
    	console.log('%s disconecting from channel: %s', socket.id, channelId);		
    	console.log('=========================================================================');
    });
  });
});

process.stdin.on('data', function (chunk) {
	var channelName = 'BlubbleChannel';
	var data = chunk.toString().toLowerCase().trim();

	switch(data) {
		case 'jigar':
		blubbleUpChannel.emit('blubble.new', [
		new Blubble({}, 'Jigar', 'Jigar', 'images/Jigar.png', [
		]),
		]);
		break;
		case 'niraj':
		blubbleUpChannel.emit('blubble.new', [
		new Blubble({}, 'Niraj', 'Niraj', 'images/Niraj.png', [
		]),
		]);
		break;
		case 'darshan':
		blubbleUpChannel.emit('blubble.new', [
		new Blubble({}, 'Darshan', 'Darshan', 'images/Darshan.png', [
		])
		]);
		break;
		case 'prateek':
		blubbleUpChannel.emit('blubble.new', [
		new Blubble({}, 'Prateek', 'Prateek', 'images/Prateek.png', [
		]),
		]);
		break;
		case 'music':		
	      blubbleUpChannel.to(lastJoinedBlubbleName).emit('pad.new', {	
	      BlubbleName: lastJoinedBlubbleName,
	      Pads: [new MusicPad({},'images/music.png', [])]
	      });
		break;
		case 'games':
	      blubbleUpChannel.to(lastJoinedBlubbleName).emit('pad.new', {
	      BlubbleName: lastJoinedBlubbleName,
	      Pads: [new GamePad({},'images/games.png',[])]
	      });
		break;
		case 'video':
	      blubbleUpChannel.to(lastJoinedBlubbleName).emit('pad.new', {
	      BlubbleName: lastJoinedBlubbleName,
	      Pads: [new VideoPad({},'images/movies.png', [])]
	      });
		break;
		case 'photo':
	      blubbleUpChannel.to(lastJoinedBlubbleName).emit('pad.new', {
	      BlubbleName: lastJoinedBlubbleName,
	      Pads: [new PhotoPad({},'images/photos.png',[])]
	      });
		break;
		case 'device':
	      blubbleUpChannel.to(lastJoinedBlubbleName).emit('pad.new', {
	      BlubbleName: lastJoinedBlubbleName,
	      Pads: [new DevicePad({}, 'images/printer.png', [])]
	      });
		break;
		default: 
	}
});
