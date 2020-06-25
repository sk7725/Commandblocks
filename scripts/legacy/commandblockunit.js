
const commandblocksu=this.global.commandblocks;
const commandblockunit = extendContent(MessageBlock, "commandblockunit", {
  unitOn(tile,unit){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksu.hasOwnProperty(key)) commandblocksu[key]={};
    thiscmd=commandblocksu[key];
    var res=commandblocksu.command(unit,entity.message,this,"execute as @p[r=1] "+entity.message,true);
    thiscmd.didsuccess = Boolean(res);
  },
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())||player.isAdmin;
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksu[key];
  },
  handleDamage(tile,amount){
    return 0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0);
  }
});

commandblockunit.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity,commandblockunit,{
  config(){
    return this.message;
  }
}));
