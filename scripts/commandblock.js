const commandblocksi = this.global.commandblocks;
const commandblock = extendContent(MessageBlock, "commandblock", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksi.hasOwnProperty(key)) commandblocksi[key]={};
    thiscmd=commandblocksi[key];
    if(!thiscmd.hasOwnProperty("didcmd")) thiscmd.didcmd=false;
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      if(!thiscmd.didcmd){
        thiscmd.didsuccess = commandblocksi.command(tile,entity.message,this,entity.message,false);
        thiscmd.didcmd = true;
      }
      else{
        thiscmd.didsuccess=false;
      }
    }
    else{
      if(thiscmd.didcmd) thiscmd.didcmd=false;
      thiscmd.didsuccess=false;
      return;
    }
  }
});
