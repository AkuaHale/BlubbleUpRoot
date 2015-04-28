var Worker = require('ti.worker');

function TaskManager(){
}

TaskManager.prototype.Worker = Worker.createWorker('AsyncWorker.js');

TaskManager.prototype.NewTask = function(func, callback){
		TaskManager.prototype.Worker.postMessage({
		    func:func,
		    callback:callback
		});	
};

TaskManager.prototype.Worker.addEventListener("message",function(event){
    var callback = event.data.callback;
    if(callback != null){
    	callback(event.data.processedData);
    }
});

module.exports = TaskManager;
