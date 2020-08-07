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
    this.testUpdate(tile);
	},
  testUpdate(tile){
    tile.ent().incProg();
    if(tile.ent().getProg() >= 4000){
      tile.ent().setProg(0);
      tile.ent().incWave();
      if(tile.ent().getWave() >= 10) this.finishBuild(tile);
      else this.newWave(tile);
    }
  },
  newWave(tile){
    //
  },
  finishBuild(tile){
    //
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
  _progress: 0,
  _wave: 0,
  _itemID: 0,

  getProg(){
		return this._progress;
	},
	incProg(){
		this._progress += 1;
	},
  setProg(a){
		this._progress = a;
	},
  getWave(){
		return this._wave;
	},
	incWave(){
		this._wave += 1;
	},
  setWave(a){
		this._wave = a;
	},

	write(stream){
		this.super$write(stream);
		stream.writeBoolean(this._enabled);
    stream.writeShort(this._progress);
    stream.writeShort(this._wave);
    stream.writeShort(this._itemID);
	},
	read(stream,revision){
		this.super$read(stream,revision);
		this._enabled = stream.readBoolean();
    this._progress = stream.readShort();
    this._wave = stream.readShort();
    this._itemID = stream.readShort();
	}
}));
