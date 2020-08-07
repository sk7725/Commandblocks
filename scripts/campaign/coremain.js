const shader=this.global.shaders.bittrium;

const coremain = extendContent(CoreBlock, "coremain",{
  draw(tile){
    this.super$draw(tile);
    Draw.shader(shader);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.shader();
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name);
    this.animRegion = Core.atlas.find(this.name+"-anim");
  }
});

const coremainbuild = extendContent(Block, "coremainbuild",{
  blockpos: {},
  draw(tile){
    this.super$draw(tile);
    Draw.shader(shader);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.shader();
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(coremain.name);
    this.animRegion = Core.atlas.find(coremain.name+"-anim");

    Events.on(EventType.WorldLoadEvent, run(event => {
			coremainbuild.blockpos = {};
		}));
  },
  canPlaceOn(tile){
		if(Vars.headless){
			//todo find a good way to check team on non-local clients
			return true;
		}else{
			return !(Vars.player.getTeam().id in this.blockpos);
		}
	},
  removed(tile){
		if(this.blockpos[tile.getTeamID()] == tile.pos()){
			delete this.blockpos[tile.getTeamID()];
		}
		this.super$removed(tile);
	},
  update(tile){
		this.super$update(tile);
		var ent = tile.ent();
		if(!ent.enabled()) return;
		if(!ent.isValidated()){
			ent.validate();
			if(tile.getTeamID() in this.blockpos) ent.disable();
			else this.blockpos[tile.getTeamID()] = tile.pos();
		}
    //stuff
	}
});

coremainbuild.entityType = prov(() => extend(TileEntity , {
	//to reduce checks
	_validated: false,
	isValidated(){
		return this._validated;
	},
	validate(){
		this._validated = true;
	},
	_enabled: true,
	enabled(){
		return this._enabled;
	},
	disable(){
		this._enabled = false;
	},

	write(stream){
		this.super$write(stream);
		stream.writeBoolean(this._enabled);
	},
	read(stream,revision){
		this.super$read(stream,revision);
		this._enabled=stream.readBoolean();
	}
}));
