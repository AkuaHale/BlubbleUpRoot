var ImageFactory = require('ti.imagefactory');

function ImageManager(){	
}

ImageManager.prototype.ImageWithAlpha = function(image_, options_){
	return ImageFactory.imageWithAlpha(image_, options_);
};

ImageManager.prototype.ImageWithTransparentBorder = function(image_, borderSize_){
	return ImageFactory.imageWithTransparentBorder(image_, {
		borderSize: borderSize_
	});
};

ImageManager.prototype.ImageWithRoundedCorner = function(image_, borderSize_, cornerRadius_){
	return ImageFactory.imageWithRoundedCorner(image_, {
		borderSize: borderSize_,
		cornerRadius: cornerRadius_
	});
};

ImageManager.prototype.ImageAsThumbnail = function(image_, size_, borderSize_, cornerRadius_, quality_){
	return ImageFactory.imageAsThumbnail(image_, {
		size: size_,
		borderSize: borderSize_,
		cornerRadius: cornerRadius_,
		quality: quality_
	});
};

ImageManager.prototype.ImageAsResized = function(image_, width_, height_, quality_, hires_){
	return ImageFactory.imageAsResized(image_, {
		width: width_,
		height: height_,
		quality: quality_,
		hires: hires_
	});
};

ImageManager.prototype.ImageAsCropped = function(image_, width_, height_, x_, y_){
	return ImageFactory.imageAsCropped(image_, {
		width: width_,
		height: height_,
		x: x_,
		y: y_
	});
};

ImageManager.prototype.ImageTransform = function(image_, options_){
	return ImageFactory.imageTransform(image_, options_);
};

ImageManager.prototype.Compress = function(image_, compressionQty_){
	return ImageFactory.compress(image_, compressionQty_);
};

module.exports = ImageManager;