
const commandblocksr=this.global.commandblocks;
const commandblockrepeating = extendContent(MessageBlock, "commandblockrepeating", {
  update(tile){
    var entity=tile.ent();
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      this.success=commandblocksr.command(tile,entity.message,this);
    }
    else{
      this.success=false;
      return;
    }
  }
});
