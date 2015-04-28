var args = arguments[0]||{};

var the_image = args.image || '';
var item_width = args.width || '95%';
var item_height = args.height || '95%';
var item_title = args.title || '';
var item_showTitle = args.showTitle || false;

$.mainView.height = item_height;
$.mainView.width = item_width;


if(item_showTitle == true){
	item_width = item_width-15;
	item_height = item_height-15;		
	$.title.text = item_title;
}


$.thumb.image = the_image;
$.thumb.width = item_width;
$.thumb.height = item_height;

this.UpdateImage = function(newImage){
	$.thumb.image = newImage;
	Ti.API.info('Updating Image:'+newImage);	
};
