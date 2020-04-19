const commandblocksi = this.global.commandblocks;
const commandblock = extendContent(MessageBlock, "commandblock", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!this.global.commandblocks.hasOwnProperty(key)) this.global.commandblocks[key]={};
    thiscmd=this.global.commandblocks[key];
    if(!thiscmd.hasOwnProperty("didcmd")) thiscmd.didcmd=false;
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!thiscmd.didcmd){
        thiscmd.didsuccess = commandblocksi.command(tile,entity.message,this);
        thiscmd.didcmd = true;
      }

    }
    else{
      if(thiscmd.didcmd) thiscmd.didcmd=false;
      thiscmd.didsuccess=false;
      return;
    }
  }
});
