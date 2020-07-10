const shader=this.global.shaders.space;
const enderbox = extendContent(Block,"enderbox",{
  localpos: [],
  core: -1,
  debugCore(tile){
    this.core = -1;
    for(var i=0;i<this.localpos.length;i++){
      if(Vars.world.tile(this.localpos[i]).block().name != this.name){
        this.localpos.splice(i, 1);
        i--;
      }
    }
    for(var i=0;i<this.localpos.length;i++){
      if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
    }
    if(this.core == -1){
      this.localpos.push(tile.pos());
      this.core = tile.pos();
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
  handleItem(item, tile, source){
    if(!(tile.pos() == this.core)){
      if(this.core == -1 || Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      this.handleItem(item, Vars.world.tile(this.core), source);
    }
    else if(Vars.net.server() || !Vars.net.active()){
      this.super$handleItem(item, tile, source);
    }
  },
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
    this.animRegion=Core.atlas.find(this.name+"-anim");
    Events.on(EventType.WorldLoadEvent, run(event => {
			this.localpos = [];
      this.core = -1;
		}));
  },
  say(tile, msg){
    Call.sendMessage(msg+"|"+tile.ent());
  },
  placed(tile){
    //this.say(tile, "PLACED");
    this.super$placed(tile);
    if(this.core == -1 || Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
    if(this.core != tile.pos()){
      tile.ent().items = Vars.world.tile(this.core).ent().items;
      this.localpos.push(tile.pos());
    }

    for(var i=0;i<this.localpos.length;i++){
      if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
    }

  },
  removed(tile){
    //this.say(tile, "REMOVED");
    var index = this.localpos.indexOf(tile.pos());
    print(index);
    if(index<0) return; //this should not happen
    this.localpos.splice(index, 1);
    if(this.core == tile.pos()){
      this.core = -1;

      for(var i=0;i<this.localpos.length;i++){
        if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
      }
      if(this.core != -1) Vars.world.tile(this.core).ent().items = tile.ent().items;
    }
    this.super$removed(tile);
  },
  update(tile){
    if(this.localpos.indexOf(tile.pos())<0){
      this.localpos.push(tile.pos());
      for(var i=0;i<this.localpos.length;i++){
        if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
      }
      if(this.core != tile.pos()){
        tile.ent().items = Vars.world.tile(this.core).ent().items;
      }
    }
  },
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.shader(shader);
    Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
    Draw.shader();
  }
});
