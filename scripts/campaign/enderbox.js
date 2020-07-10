const shader=this.global.shaders.space;
const enderbox = extendContent(Block,"enderbox",{
  localpos: [],
  core: [],
  debugCore(tile){
    this.core[tile.getTeamID()] = -1;
    if(this.localpos[tile.getTeamID()] == undefined || this.localpos[tile.getTeamID()] == null){
      this.localpos[tile.getTeamID()] = [];
    }
    for(var i=0;i<this.localpos[tile.getTeamID()].length;i++){
      if(Vars.world.tile(this.localpos[tile.getTeamID()][i]).block().name != this.name){
        this.localpos[tile.getTeamID()].splice(i, 1);
        i--;
      }
    }
    for(var i=0;i<this.localpos[tile.getTeamID()].length;i++){
      if(this.core[tile.getTeamID()] == -1 || this.localpos[tile.getTeamID()][i] < this.core[tile.getTeamID()]) this.core[tile.getTeamID()] = this.localpos[tile.getTeamID()][i];
    }
    if(this.core[tile.getTeamID()] == -1){
      this.localpos[tile.getTeamID()].push(tile.pos());
      this.core[tile.getTeamID()] = tile.pos();
    }
  },
  /*
  acceptItem(item, tile, source){
    if(tile.pos() == this.core){
      return this.super$acceptItem(item, tile, source);
    }
    else{
      if(this.core == -1 || Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      return this.acceptItem(item, Vars.world.tile(this.core), source);
    }
  },
  drawSelect(tile){
    if(tile.pos() == this.core){
      this.super$drawSelect(tile);
    }
    else{
      //if(this.core == -1 || Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      this.drawSelect(Vars.world.tile(this.core));
    }
  },
  removeItem(tile, item){
    var entity = tile.ent();
    if(item == null){
      return entity.items.take();
    }
    else{
      if(entity.items.has(item)){
          entity.items.remove(item, 1);
          return item;
      }
      return null;
    }
  }
    public boolean hasItem(Tile tile, Item item){
        TileEntity entity = tile.entity;
        if(item == null){
            return entity.items.total() > 0;
        }else{
            return entity.items.has(item);
        }
    }*/
  acceptItem(item, tile, source){
    return tile.ent().items.get(item) < this.getMaximumAccepted(tile, item);
  },
  /*
  handleItem(item, tile, source){
    if(this.core[tile.getTeamID()] == undefined || this.core[tile.getTeamID()] == null) this.core[tile.getTeamID()] = -1;
    if(!(tile.pos() == this.core[tile.getTeamID()])){
      if(this.core[tile.getTeamID()] == -1 || Vars.world.tile(this.core[tile.getTeamID()]).block().name != this.name) this.debugCore(tile);
      this.handleItem(item, Vars.world.tile(this.core[tile.getTeamID()]), source);
    }
    else if(Vars.net.server() || !Vars.net.active()){
      this.super$handleItem(item, tile, source);
    }
  },*/
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.animRegion=Core.atlas.find(this.name+"-anim");
    Events.on(EventType.WorldLoadEvent, run(event => {
			this.localpos = [];
      this.core = [];
		}));
  },
  say(tile, msg){
    Call.sendMessage(msg+"|"+tile.ent());
  },
  placed(tile){
    //this.say(tile, "PLACED");
    this.super$placed(tile);
    if(this.core[tile.getTeamID()] == undefined || this.core[tile.getTeamID()] == null) this.core[tile.getTeamID()] = -1;
    if(this.localpos[tile.getTeamID()] == undefined || this.localpos[tile.getTeamID()] == null){;
      this.localpos[tile.getTeamID()] = [];
    }
    if(this.core[tile.getTeamID()] == -1 || Vars.world.tile(this.core[tile.getTeamID()]).block().name != this.name) this.debugCore(tile);
    if(this.core[tile.getTeamID()] != tile.pos()){
      tile.ent().items = Vars.world.tile(this.core[tile.getTeamID()]).ent().items;
      this.localpos[tile.getTeamID()].push(tile.pos());
    }

    for(var i=0;i<this.localpos[tile.getTeamID()].length;i++){
      if(this.core[tile.getTeamID()] == -1 || this.localpos[tile.getTeamID()][i] < this.core[tile.getTeamID()]) this.core[tile.getTeamID()] = this.localpos[tile.getTeamID()][i];
    }

  },
  removed(tile){
    //this.say(tile, "REMOVED");
    //Call.sendMessage(this.localpos[tile.getTeamID()]);
    if(this.core[tile.getTeamID()] == undefined || this.core[tile.getTeamID()] == null) this.core[tile.getTeamID()] = -1;
    if(this.localpos[tile.getTeamID()] == undefined || this.localpos[tile.getTeamID()] == null){
      this.localpos[tile.getTeamID()] = [];
    }
    var index = this.localpos[tile.getTeamID()].indexOf(tile.pos());
    print(index);
    if(index<0) return; //this should not happen
    this.localpos[tile.getTeamID()].splice(index, 1);
    if(this.core[tile.getTeamID()] == tile.pos()){
      this.core[tile.getTeamID()] = -1;

      for(var i=0;i<this.localpos[tile.getTeamID()].length;i++){
        if(this.core[tile.getTeamID()] == -1 || this.localpos[tile.getTeamID()][i] < this.core[tile.getTeamID()]) this.core[tile.getTeamID()] = this.localpos[tile.getTeamID()][i];
      }
      if(this.core[tile.getTeamID()] != -1) Vars.world.tile(this.core[tile.getTeamID()]).ent().items = tile.ent().items;
    }
    this.super$removed(tile);
  },
  /*
  onProximityUpdate(tile){
    this.super$onProximityUpdate(tile);
    if(this.core[tile.getTeamID()] == undefined || this.core[tile.getTeamID()] == null) this.core[tile.getTeamID()] = -1;
    if(this.localpos[tile.getTeamID()] == undefined || this.localpos[tile.getTeamID()] == null){
      this.localpos[tile.getTeamID()] = [];
    }
    var index = this.localpos[tile.getTeamID()].indexOf(tile.pos());
    print(index);
    if(index<0) return; //not yet registered
    if(this.core[tile.getTeamID()] == -1 || Vars.world.tile(this.core[tile.getTeamID()]).block().name != this.name) this.debugCore(tile);
    if(this.core[tile.getTeamID()] != tile.pos()) tile.ent().items = Vars.world.tile(this.core[tile.getTeamID()]).ent().items;
  },*/
  update(tile){
    if(this.core[tile.getTeamID()] == undefined || this.core[tile.getTeamID()] == null) this.core[tile.getTeamID()] = -1;
    if(this.localpos[tile.getTeamID()] == undefined || this.localpos[tile.getTeamID()] == null){
      this.localpos[tile.getTeamID()] = [];
    }
    if(this.localpos[tile.getTeamID()].indexOf(tile.pos())<0){
      this.localpos[tile.getTeamID()].push(tile.pos());
      for(var i=0;i<this.localpos[tile.getTeamID()].length;i++){
        if(this.core[tile.getTeamID()] == -1 || this.localpos[tile.getTeamID()][i] < this.core[tile.getTeamID()]) this.core[tile.getTeamID()] = this.localpos[tile.getTeamID()][i];
      }
      if(this.core[tile.getTeamID()] != tile.pos()){
        tile.ent().items = Vars.world.tile(this.core[tile.getTeamID()]).ent().items;
      }
    }
    if(this.core[tile.getTeamID()] != -1 && this.core[tile.getTeamID()] != tile.pos() && tile.ent().items != Vars.world.tile(this.core[tile.getTeamID()]).ent().items) tile.ent().items = Vars.world.tile(this.core[tile.getTeamID()]).ent().items;
  },
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.shader(shader);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.shader();
  }
});
