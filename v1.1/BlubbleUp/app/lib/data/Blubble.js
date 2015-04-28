function Blubble(id, userName, blubbleName, image, pads, isRemote){
	this.Id = id;
	this.IPAddress = {};
	this.Port={};
	this.IsRemote= isRemote;
	if(isRemote == null){
		this.IsRemote= true;
	}
	this.UserName = userName;
	this.Name = blubbleName;
	this.Image = image;
	this.Pads = pads;	
}

module.exports = Blubble;