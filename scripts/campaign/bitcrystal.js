const shader=this.global.shaders.bittrium;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;

const bitcrystal = extendContent(Block, "bitcrystal",{
  blockpos: {},
  blockcount: [],
  checkpos: [],
  lastCosts: [],
  lastProgs: [],
  hasLast: false,
  bittrium: null,
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

    Events.on(EventType.WorldLoadEvent, run(event => {
      bitcrystal.hasLast = [];
			bitcrystal.blockpos = {};
      bitcrystal.blockcount = [];
      bitcrystal.checkpos = [];
		}));
  },
  shouldActiveSound(tile){
    return tile.ent().cons.valid() && this.getParentEnt(tile.ent()).getProg(tile.ent().getItemID()) > 0;
    //tba set item to null at start
  },
  /*
  drawLight(tile){

    if(tile.ent().items.total() <= 0) return;
    this.color1 = Pal.lightFlame;
    var index = fireitem.indexOf(tile.ent().items.first().name);
    if(index > -1){
      this.color1 = firecolor[index];
    }
    Vars.renderer.lights.add(tile.drawx(), tile.drawy(), 170+10*Mathf.random(), this.color1, (tile.ent().items.total()>0)?0.9:0);

  },
  */
  hasWave(){
    return Vars.state.rules.waves && Vars.state.rules.waveTimer && !Vars.state.rules.pvp && !Vars.state.rules.attackMode && !Vars.state.rules.infiniteResources && !Vars.state.rules.editor;
  },
  placed(tile){
    //hmm
  },
  removed(tile){
    if(this.blockpos[tile.getTeamID()] == tile.pos()){
      delete this.blockpos[tile.getTeamID()];
      this.lastProgs[tile.getTeamID()] = tile.ent().getProgArr();
      this.lastCosts[tile.getTeamID()] = tile.ent().getCostArr();
      this.hasLast[tile.getTeamID()] = true;
    }
    if(this.checkpos[tile.pos()]){
      this.checkpos[tile.pos()] = false;
      this.blockcount[tile.getTeamID()]--;
    }
    this.super$removed(tile);
  },
  handleDamage(tile, amount){
    if(this.blockcount[tile.getTeamID()] <= 1) return 0;
    return this.super$handleDamage(tile, amount);
  },
  handleBulletHit(entity, bullet){
    if(this.blockcount[tile.getTeamID()] <= 1) entity.damage(0);
    else this.super$handleBulletHit(entity, bullet);
  },
  canBreak(tile){
		return this.super$canBreak(tile)&&this.blockcount[tile.getTeamID()]>1;
	},
  update(tile){
		this.super$update(tile);
		var ent = tile.ent();
    if(!(tile.getTeamID() in this.blockpos) && this.hasLast[tile.getTeamID()]){
      this.hasLast[tile.getTeamID()] = false;
      this.blockpos[tile.getTeamID()] = tile.pos();
      ent.setProgArr(this.lastProgs[tile.getTeamID()]);
      ent.setCostArr(this.lastCosts[tile.getTeamID()]);
    }
    else if(ent.parentTile() == null && this.blockpos[tile.getTeamID()] != tile.pos() && (tile.getTeamID() in this.blockpos)) ent.setParent(this.blockpos[tile.getTeamID()]);
		if(ent.parentTile() == null && !ent.isValidated()){
			ent.validate();
			if(tile.getTeamID() in this.blockpos) ent.setParent(this.blockpos[tile.getTeamID()]);
			else this.blockpos[tile.getTeamID()] = tile.pos();
		}
    if(!this.checkpos[tile.pos()]){
      this.checkpos[tile.pos()] = true;
      if(this.blockcount[tile.getTeamID()] == null) this.blockcount[tile.getTeamID()] = 0;
      this.blockcount[tile.getTeamID()]++;
    }

    if(this.bittrium == null || this.bittrium.name != "commandblocks-bittrium") this.bittrium =  Vars.content.getByName(ContentType.item, "commandblocks-bittrium");
    var pent = tile.ent();
    if(tile.ent().parentTile() != null) pent = tile.ent().parentTile().ent();
    if(pent.getProg(tile.ent().getItemID()) >= pent.getCostPow(tile.ent().getItemID())){
      pent.addProg(tile.ent().getItemID(), -1*pent.getCostPow(tile.ent().getItemID()));
      pent.incCost(tile.ent().getItemID());
      this.useContent(tile, this.bittrium);
      this.offloadNear(tile, this.bittrium);
      newSounds.boostsound.at(tile.drawx(), tile.drawy());
    }

    this.tryDump(tile, this.bittrium);
	},
  getParentEnt(entity){
    if(entity.parentTile() == null) return entity;
    else return entity.parentTile().ent();
  },

  setBars(){
    this.super$setBars();
    this.bars.add(
      "itemcount", func(entity => {
        var pent = this.getParentEnt(entity);
        return new Bar(
          prov(() => pent.getProg(entity.getItemID()) + "/" + pent.getCostPow(entity.getItemID())),
          prov(() => (entity.getItem() == null)?Color.white:entity.getItem().color),
          floatp(() => {
            return pent.getProg(entity.getItemID())/pent.getCostPow(entity.getItemID());
          })
        )
      })
    );
  },
  setStats(){
    this.super$setStats();
    this.stats.add(BlockStat.output, Vars.content.getByName(ContentType.item, "commandblocks-bittrium"));
  },

  getMaximumAccepted(tile, item){
    return 1024;//I CAN DO ANYTHING!
  },
  handleStack(item, amount, tile, source){
    var pent = this.getParentEnt(tile.ent());
    tile.ent().setItemID(item.id);
    pent.addProg(item.id, amount);
  },
  handleItem(item, tile, source){
    if(item.name == "commandblocks-bittrium"){
      this.super$handleItem(item, tile, source);
      return;
    }
    var pent = this.getParentEnt(tile.ent());
    tile.ent().setItemID(item.id);
    pent.incProg(item.id);
  },
  acceptItem(item, tile, source){
    return (item.name != "commandblocks-bittrium") || tile == source;
  }
});
bitcrystal.activeSound = newSounds.sparklebg;

bitcrystal.entityType = prov(() => extend(TileEntity , {
	//to reduce checks
	_validated: false,
	isValidated(){
		return this._validated;
	},
	validate(){
		this._validated = true;
	},
	_parent: -1,
	parent(){
		return this._parent;
	},
  parentTile(){
    if(this._parent == -1 || !this._parent) return null;
    var rtile = Vars.world.tile(this._parent);
    if(rtile.block() != bitcrystal) return null;
    return rtile;
  },
	setParent(p){
		this._parent = p;
	},
  _itemID: 0,
  _itemCosts: [],
  _itemProgs: [],

  getProg(id){
    if(!this._itemProgs[id]) return 0;
		return this._itemProgs[id];
	},
	incProg(id){
    if(!this._itemProgs[id]) this._itemProgs[id] = 0;
		this._itemProgs[id] += 1;
	},
  addProg(id, a){
    if(!this._itemProgs[id]) this._itemProgs[id] = 0;
		this._itemProgs[id] += a;
	},
  setProg(id, a){
		this._itemProgs[id] = a;
	},
  getCost(id){
    if(!this._itemCosts[id]) return 0;
		return this._itemCosts[id];
	},
  getCostPow(id){
    if(!this._itemCosts[id]) return 1;
		return Mathf.pow(2, this._itemCosts[id]);
	},
	incCost(id){
    if(!this._itemCosts[id]) this._itemCosts[id] = 0;
		this._itemCosts[id] += 1;
    if(this._itemCosts[id] > 20) this._itemCosts[id] = 20;
	},
  setCost(id, a){
		this._itemCosts[id] = a;
	},

  getItemID(){
    return this._itemID;
  },
  setItemID(id){
    if(id < 0) id = 0;
    this._itemID = id;
  },
  getItem(){
    return Vars.content.getByID(ContentType.item, this._itemID);
    //can be null
  },
  getProgArr(){
    return this._itemProgs;
  },
  setProgArr(arr){
    this._itemProgs = arr;
  },
  getCostArr(){
    return this._itemCosts;
  },
  setCostArr(arr){
    this._itemCosts = arr;
  },

	write(stream){
		this.super$write(stream);
		stream.writeInt(this._parent);
    stream.writeShort(this._itemID);
    if(this.parent != -1){
      var len = this._itemProgs.length;
      stream.writeShort(len);
      for(var i=0; i<len; i++){
        if(!this._itemProgs[i]) stream.writeInt(0);
        else stream.writeInt(this._itemProgs[i]);//heavy but fuk u
      }
      len = this._itemCosts.length;
      stream.writeShort(len);
      for(var i=0; i<len; i++){
        if(!this._itemCosts[i]) stream.writeByte(0);
        else stream.writeByte(this._itemCosts[i]);
      }
    }
	},
	read(stream,revision){
		this.super$read(stream,revision);
		this._parent = stream.readInt();
    this._itemID = stream.readShort();
    if(this._parent != -1){
      var len = stream.readShort();
      for(var i=0; i<len; i++){
        this._itemProgs[i] = stream.readInt();
      }
      len = stream.readShort();
      for(var i=0; i<len; i++){
        this._itemCosts[i] = stream.readByte();
      }
    }
	}
}));
