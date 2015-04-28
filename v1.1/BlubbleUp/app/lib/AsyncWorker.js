//var worker = require('ti.worker');

var terminated = false; // for the cases of loops we need to check if the worker is terminated or not or it will keep running in the background

worker.addEventListener('terminated', function(){
	terminated = true;
});

worker.addEventListener('message',function(event){
	Ti.API.info('Async worker got message');
	var asyncFunc = event.data.func;
	if(asyncFunc != null){
		Ti.API.info('Executing Async Funtion passed');
		var processedData = asyncFunc();
		worker.postMessage({
			callback:event.data.callback,
			processedData:processedData
		});
	}
	else{
		Ti.API.info('No Async Funtion passed');
	}
    // send data back to any subscribers
    // pull data from the event from the data property
    //worker.postMessage(event.data.msg);
});

function run(){
	//Ti.API.info('worker:'+JSON.stringify(worker));
	!terminated && worker.nextTick(run);
}

run();
