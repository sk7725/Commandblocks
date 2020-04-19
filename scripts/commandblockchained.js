const commandblocksc=this.global.commandblocks;
const commandblockchained = extendContent(MessageBlock, "commandblockchained", {
  getawaypos(tx, ty, trot){
var tmpobj={};
if(trot==0){
tmpobj.x=tx-1;  tmpobj.y=ty;
}
else if(trot==1){
tmpobj.x=tx;  tmpobj.y=ty-1;
}
else if(trot==2){
tmpobj.x=tx+1;  tmpobj.y=ty;
}
else{
tmpobj.x=tx;  tmpobj.y=ty+1;
}
return tmpobj;
  },
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksc.hasOwnProperty(key)) commandblocksc[key]={};
    thiscmd=commandblocksc[key];
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      const awaypos=this.getawaypos(tile.x,tile.y,tile.rotation());
      const akey=awaypos.x+","+awaypos.y;
      if(commandblocksc.hasOwnProperty(akey)&&commandblocksc[akey].didsuccess){
        thiscmd.didsuccess = commandblocksc.command(tile,entity.message,this,entity.message,false,"tile");
      }
      else{
      thiscmd.didsuccess=false;
      return;
      }
    }
    else{
      thiscmd.didsuccess=false;
      return;
    }
/*
    if(tile.entity.cons.valid()){
      this.super$update(tile);
      //entity.cons.trigger();
      const awaypos=this.getawaypos(tile.x,tile.y,tile.rotation());
      var ax=awaypos.x; var ay=awaypos.y;
      var near = Vars.world.tile(x,y);
      if(near.block instanceof commandblock){
      tile.didsuccess=commandblocksc.command(tile,entity.message,this);
      }
    }
    else{
      tile.didsuccess=false;
      return;
    }
*/
  }
});
