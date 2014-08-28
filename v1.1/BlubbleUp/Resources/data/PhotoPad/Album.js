function Album(id, albumName, image, photos){
	this.Id = id;
	this.Name = albumName;
	this.Image = image;
	this.Photos = photos || [];
};

module.exports = Album;