commandblocks=this.global.commandblocks;
const commandblock = extendContent(MessageBlock, "commandblock", {
  init(){
    this.super$init();
		this.didcmd = false;
	},
  update(tile){
    var entity=tile.ent();
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!this.didcmd){
        commandblocks.command(tile,entity.message);
        this.didcmd = true;
      }

    }
    else{
      if(this.didcmd) this.didcmd=false;
      return;
    }
  }
});
