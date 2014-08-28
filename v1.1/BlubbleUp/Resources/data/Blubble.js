function Blubble(id, userName, blubbleName, image, pads){
	this.Id = id;
	this.IPAddress = {};
	this.Port={};
	this.IsRemote=true;
	this.UserName = userName;
	this.Name = blubbleName;
	this.Image = image;
	this.Pads = pads;	
}

module.exports = Blubble;