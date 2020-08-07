const shader=this.global.shaders.bittrium;
const customfx = this.global.fx;

const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");

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
    Tmp.c1.set(bitcolor1).lerp(bitcolor2 ,Mathf.sin(Time.time()*0.02)*0.5+0.5); //Haha Sonnicon, you thought you've gotten rid of me for good, but I'M BACK!

    Draw.shader(Shaders.blockbuild, true);
    Shaders.blockbuild.color = Tmp.c1;
    Shaders.blockbuild.region = this.region;
    Shaders.blockbuild.progress = (tile.ent().getProg() + tile.ent().getWave()*4000)/40000;
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.flush();
    Draw.shader();

    Draw.mixcol(Tmp.c1, 1);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.mixcol();
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(coremain.name);
    this.animRegion = Core.atlas.find(coremain.name+"-anim");

    Events.on(EventType.WorldLoadEvent, run(event => {
			coremainbuild.blockpos = {};
		}));
  },
  drawLayer(tile){
    //말풍선
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
      if(tile.ent().getWave() >= 10) this.finishBuild(tile, tile.getTeam());
      else this.newWave(tile);
    }
  },
  newWave(tile){
    Effects.effect(customfx.coreMainPhase, tile.drawx(), tile.drawy());
    Effects.shake(3, 3, tile.ent());
    if(!Vars.net.client()) this.selectNextItem(tile);
    else tile.ent().nullItem();//until it is synced
  },
  finishBuild(tile, team){
    Effects.effect(customfx.coreMainSpark, tile.drawx(), tile.drawy());
    Effects.effect(customfx.coreMainSquare, tile.drawx(), tile.drawy());
    Effects.shake(4, 3, tile.ent());
    tile.remove();
    tile.set(coremain, team);
  },
  selectNextItem(tile){
    //use EoD item auctioner
  },
  setBars(){
		this.super$setBars();
		this.bars.add(
			"progress", func(entity => {
				return new Bar(
					prov(() => Core.bundle.get("bar.progress")),
					prov(() => Tmp.c1.set(bitcolor1).lerp(bitcolor2, Mathf.sin(Time.time()*0.02)*0.5+0.5)),
					floatp(() => {
						return (entity.getProg() + entity.getWave()*4000)/40000;
					})
				)
			})
		);
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

  nullItem(){
		this._itemID = 0;
    //itemID = realID + 1
	},
  getItemID(){
    return this._itemID - 1;
  },
  setItemID(id){
    if(id < 0) id = -1;
    this._itemID = i+1;
  },
  getItem(){
    return Vars.content.getByID(ContentType.item, this._itemID - 1);
    //can be null
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
