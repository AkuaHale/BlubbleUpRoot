function Photo(name_, thumbnail_, image_, isPublic_, isRemote_){
	this.Id = name_;
	this.Name = name_;
	this.Thumbnail = thumbnail_;
	this.Image = image_;
	this.IsPublic = isPublic_ || true;
	this.IsRemote = isRemote_;
}

module.exports = Photo;