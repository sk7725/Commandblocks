
const temp=extendContent(Block,"temp",{
  localpos: [],
  core: -1,
  debugCore(tile){
    this.core = -1;
    for(var i=0;i<this.localpos.length;i++){
      if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
    }
    if(this.core == -1){
      this.localpos.push(tile.pos());
      this.core = tile.pos();
    }
  },
  acceptItem(item, tile, source){
    if(tile.pos() == this.core){
      return this.super$acceptItem(item, tile, source);
    }
    else{
      if(Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      return this.acceptItem(item, Vars.world.tile(this.core), source);
    }
  },
  drawSelect(tile){
    if(tile.pos() == this.core){
      this.super$drawSelect(tile);
    }
    else{
      if(Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      this.drawSelect(Vars.world.tile(this.core));
    }
  },
  /*
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
  handleItem(item, tile, source){
    if(!tile.pos() == this.core){
      if(Vars.world.tile(this.core).block().name != this.name) this.debugCore(tile);
      this.handleItem(item, Vars.world.tile(this.core), source);
    }
    else if(Vars.net.server() || !Vars.net.active()){
      this.super$handleItem(item, tile, source);
    }
  },
  load(){
    Events.on(EventType.WorldLoadEvent, run(event => {
			this.localpos = [];
      this.core = -1;
		}));
  },
  say(tile, msg){
    Call.sendMessage(msg+"|"+tile.ent());
  },
  placed(tile){
    this.say(tile, "PLACED");
    this.localpos.push(tile.pos());
    for(var i=0;i<this.localpos.length;i++){
      if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
    }
  },
  playerPlaced(tile){
    this.say(tile, "PLAYERPLACED");
  },
  removed(tile){
    this.say(tile, "REMOVED");
    var index = this.localpos.indexOf(tile.pos());
    if(index<0) return; //this should not happen
    if(this.core == tile.pos()) this.core = -1;
    this.localpos.splice(index, 1);
    for(var i=0;i<this.localpos.length;i++){
      if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
    }
  },
  onDestroyed(tile){
    this.say(tile, "ONDESTROYED");
  },
  update(tile){
    if(this.core == -1){
      this.localpos.push(tile.pos());
      for(var i=0;i<this.localpos.length;i++){
        if(this.core == -1 || this.localpos[i] < this.core) this.core = this.localpos[i];
      }
    }
  },
  draw(tile){
    if(this.core == tile.pos()) Draw.color(Pal.accent);
    Draw.rect("error", tile.drawx(), tile.drawy())
    Draw.color();
  }
});
