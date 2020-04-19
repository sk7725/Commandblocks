const commandblocksi = this.global.commandblocks;
const commandblock = extendContent(MessageBlock, "commandblock", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  update(tile){
    var entity=tile.ent();
    if(!tile.hasOwnProperty('didcmd') tile.didcmd=false;
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!tile.didcmd){
        tile.didsuccess = commandblocksi.command(tile,entity.message,this);
        tile.didcmd = true;
      }

    }
    else{
      if(tile.didcmd) tile.didcmd=false;
      tile.didsuccess=false;
      return;
    }
  }
});
