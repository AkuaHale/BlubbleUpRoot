function Album(name_, image_, items_, isPublic_){
	this.Id = name_;
	this.Name = name_;
	this.Image = image_;
	this.Items = items_ || [];	
	this.IsPublic = isPublic_;
}

Album.prototype.getImage = function(){
	var image = this.Image;
	if(image == null){
		if(this.Items == null || this.Items.length == 0){
			image = '/images/photos.png';		
		}
		else{
			image = this.Items[0].Thumbnail;
		}
	}	
	return image;
};

module.exports = Album;