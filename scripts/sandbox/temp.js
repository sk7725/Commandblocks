
const temp=extendContent(Block,"temp",{
  localpos: [],
  core: -1,
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
    if(this.core == tile.pos()) this.code = -1;
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
    this.super$draw(tile);
    Draw.color();
  }
});
