
const commandblocksr=this.global.commandblocks;
const commandblockrepeating = extendContent(MessageBlock, "commandblockrepeating", {
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksr.hasOwnProperty(key)) commandblocksr[key]={};
    thiscmd=commandblocksr[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      thiscmd.didsuccess = commandblocksr.command(tile,entity.message,this,entity.message,false);
    }
    else{
      thiscmd.didsuccess=false;
      return;
    }
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksr[key];
  }
});
