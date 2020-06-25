const commandblocksi = this.global.commandblocks;
const commandblock = extendContent(MessageBlock, "commandblock", {
  init(){
    this.super$init();
		//tile.didcmd = false;
	},
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())||player.isAdmin;
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
        //if(Core.input.keyDown(KeyCode.F12)) return;
        var res=commandblocksi.command(tile,entity.message,this,entity.message,false);
        thiscmd.didsuccess = Boolean(res);
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
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksi[key];
  },
  handleDamage(tile,amount){
    return 0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0);
  }
});

commandblock.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity,commandblock,{
  config(){
    return this.message;
  }
}));
