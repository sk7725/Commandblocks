const shader=this.global.shaders.bittrium;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;

const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");

var simplex = new Packages.arc.util.noise.Simplex();

function getNoise(x, y, scl, mag, oct, pers, o){
  return simplex.octaveNoise2D(oct, pers, 1 / scl, x + o, y + o) * mag;
}

function isOre(x, y, scl, oct, fall, thresh, o){
  var noise = getNoise(x, y, scl, 1, oct, fall, o);
  return noise > thresh;
}

function placeOre(x, y, ore){
  var otile = Vars.world.tile(x, y);
  if(otile == null || otile.overlay().name == "spawn" || otile.floor().isLiquid) return;
  if(!(otile.block().name == "air" || otile.synthetic())) return; //do not place under static blocks
  Effects.effect(customfx.placeOre, ore.itemDrop.color, otile.worldx(), otile.worldy(), 0);
  otile.setOverlay(ore);
}

function tryOre(x, y, scl, oct, fall, thresh, ore, o){
  if(isOre(x, y, scl, oct, fall, thresh, o)) placeOre(x, y, ore);
}


const coremain = extendContent(CoreBlock, "coremain",{
  checkpos: [],
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
			coremain.checkpos = [];
		}));
  },
  update(tile){
    this.super$update(tile);
    if(!this.checkpos[tile.pos()]){
      coremainbuild.blockpos[tile.getTeamID()] = tile.pos();
      this.checkpos[tile.pos()] = true;
    }
  },
  forceGameOver(){
    Vars.state.gameOver = true;
    Events.fire(new EventType.GameOverEvent(Vars.state.rules.waveTeam));
  },
  removed(tile){
    if(coremainbuild.blockpos[tile.getTeamID()] == tile.pos()){
			delete coremainbuild.blockpos[tile.getTeamID()];
		}
    this.checkpos[tile.pos()] = false;
    this.super$removed(tile);

  },
  onDestroyed(tile){
    this.super$onDestroyed(tile);
    if(this.canGameOver()) this.forceGameOver();
  },
  canGameOver(){
    return !Vars.state.rules.pvp && !Vars.state.rules.infiniteResources && Vars.state.rules.canGameOver && !Vars.state.rules.editor;
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
    this.itemRegion = Core.atlas.find(this.name+"-item");

    Events.on(EventType.WorldLoadEvent, run(event => {
			coremainbuild.blockpos = {};
		}));
  },
  drawLayer(tile){
    if(tile.ent().getItem() == null) return;
    var yoff = tile.drawy() + 20 + Mathf.sin(Time.time()*0.05);
    Draw.rect(this.itemRegion, tile.drawx(), yoff);
    Draw.rect(tile.ent().getItem().icon(Cicon.medium), tile.drawx(), yoff);
  },
  getDisplayName(tile){
    return Core.bundle.format("block.constructing", coremain.localizedName);
  },
  canPlaceOn(tile){
    if(this.hasWave() && Vars.state.wave < 99) return false;
		if(Vars.headless){
			//todo find a good way to check team on non-local clients
			return true;
		}else{
			return !(Vars.player.getTeam().id in this.blockpos);
		}
	},
  hasWave(){
    return Vars.state.rules.waves && Vars.state.rules.waveTimer && !Vars.state.rules.pvp && !Vars.state.rules.attackMode && !Vars.state.rules.infiniteResources && !Vars.state.rules.editor;
  },
  placed(tile){
    //show dialog
    if(Vars.headless) return;
    Vars.ui.showOkText(Core.bundle.get("hardmode.name"), Core.bundle.get("hardmode.description"), run(()=>{}));
    if(!Vars.net.client()) this.selectNextItem(tile, null);
  },
  removed(tile){
		if(this.blockpos[tile.getTeamID()] == tile.pos()){
			delete this.blockpos[tile.getTeamID()];
		}
		this.super$removed(tile);
	},
  update(tile){
    if(tile.ent() instanceof CoreBlock.CoreEntity) return;//but this should not happen
		this.super$update(tile);
		var ent = tile.ent();
		if(!ent.enabled()) return;
		if(!ent.isValidated()){
			ent.validate();
			if(tile.getTeamID() in this.blockpos) ent.disable();
			else this.blockpos[tile.getTeamID()] = tile.pos();
		}
    //stuff
    //this.testUpdate(tile);
	},
  testUpdate(tile){
    tile.ent().addProg(80);
    this.updateWave(tile);
  },
  updateWave(tile){
    if(tile.ent().getProg() >= 4000){
      tile.ent().setProg(0);
      tile.ent().incWave();
      if(tile.ent().getWave() >= 10) this.finishBuild(tile, tile.getTeam());
      else this.newWave(tile, tile.ent().getItemID());
      return true;
    }
    else return false;
  },
  newWave(tile, avoid){
    tile.ent().nullItem();//until it is synced
    newSounds.boostsound.at(tile.drawx(), tile.drawy());
    Effects.effect(customfx.coreMainPhase, tile.drawx(), tile.drawy());
    Effects.shake(3, 3, tile.ent());
    if(!Vars.net.client()) this.selectNextItem(tile, avoid);
    this.forceEnemyWave(tile.ent().getWave());
  },
  finishBuild(tile, team){
    Sounds.corexplode.at(tile.drawx(), tile.drawy());
    Effects.effect(customfx.coreMainSpark, tile.drawx(), tile.drawy());
    Effects.effect(customfx.coreMainSquare, tile.drawx(), tile.drawy());
    Effects.shake(4, 3, tile.ent());
    //Vars.ui.showOkText(Core.bundle.get("hardmode.name"), Core.bundle.get("hardmode.start"), run(()=>{}));
    if(!Vars.headless) Vars.ui.hudfrag.showToast(Core.bundle.get("hardmode.start"));
    this.placeOres(tile);
    tile.remove();
    tile.set(coremain, team);
    this.blockpos[tile.getTeamID()] = tile.pos();
  },

  forceEnemyWave(n){
    for(var i=0; i<n; i++){
      Vars.logic.runWave();//UNLEASH HELL
    }
  },

  placeOres(tile){
    simplex.setSeed(tile.pos());
    this.placeOreType(Vars.content.getByName(ContentType.block, "commandblocks-depo-scalar"), 0);
    this.placeOreType(Vars.content.getByName(ContentType.block, "commandblocks-depo-vector"), 628);
    this.placeOreType(Vars.content.getByName(ContentType.block, "commandblocks-depo-zeta"), 9999);
    this.placeOreType(Vars.content.getByName(ContentType.block, "commandblocks-depo-code"), 654321);
  },

  placeOreType(ore, o){
    for(var i=0; i<Vars.world.width(); i++){
      for(var j=0; j<Vars.world.height(); j++){
        tryOre(i, j, ore.oreScale, 2, 0.3, ore.oreThreshold, ore, o);
      }
    }
  },

  selectNextItem(tile, avoid){
    //use EoD item auctioner
    var arr = Vars.content.items().toArray();
    arr = arr.filter(item => !item.name.includes("commandblocks-"));
    //print(item.name);
    arr = arr.sort(function(i1, i2) {
      return i1.cost*50+(i1.hardness+1) - i2.cost*50+(i2.hardness+1);
    });

    var arrpos = Mathf.floorPositive(Math.max((tile.ent().getWave()/10 + Mathf.random(-0.1, 0.09))*arr.length, 0));
    if(arrpos >= arr.length) arrpos = arr.length - 1;
    if(avoid != null && arr[arrpos] == avoid && arrpos+1 < arr.length) arrpos++;
    tile.configure(arr[arrpos].id+1);
  },
  configured(tile, player, value){
    if(value <= 0) return;
    tile.ent().setItemID(value-1);
  },

  canBreak(tile){
    return !tile.ent().enabled() || tile.ent().getWave()<1;
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
    this.bars.add(
      "itemcount", func(entity => {
        return new Bar(
          prov(() => entity.getProg() + "/4000"),
          prov(() => (entity.getItem() == null)?Color.white:entity.getItem().color),
          floatp(() => {
            return entity.getProg()/4000;
          })
        )
      })
    );
  },

  getMaximumAccepted(tile, item){
    return 1024;//I CAN DO ANYTHING!
  },
  handleStack(item, amount, tile, source){
    tile.ent().addProg(amount);
    this.updateWave(tile);
  },
  handleItem(item, tile, source){
    tile.ent().incProg();
    this.updateWave(tile);
  },
  acceptItem(item, tile, source){
    return tile.ent().getItem() != null && tile.ent().getItem() == item;
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
  addProg(a){
		this._progress += a;
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
    this._itemID = id+1;
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
