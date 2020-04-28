
const commandblocksr=this.global.commandblocks;
const commandblockrepeating = extendContent(MessageBlock, "commandblockrepeating", {
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksr.hasOwnProperty(key)) commandblocksr[key]={};
    thiscmd=commandblocksr[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      var res=commandblocksr.command(tile,entity.message,this,entity.message,false);
      thiscmd.didsuccess = Boolean(res);
    }
    else{
      thiscmd.didsuccess=false;
      return;
    }
  },
  shouldShowConfigure(tile, player){
    return player.isLocal||player.isAdmin;
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksr[key];
  }
});

commandblockrepeating.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity,commandblockrepeating,{
  config(){
    return this.message;
  }
}));
