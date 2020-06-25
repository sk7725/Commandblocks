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
  shouldShowConfigure(tile, player){
    return (!Vars.net.active())||player.isAdmin;
  },
  update(tile){
    var entity=tile.ent();
    var key=tile.x+","+tile.y;
    if(!commandblocksc.hasOwnProperty(key)) commandblocksc[key]={};
    thiscmd=commandblocksc[key];
    if(true){
      this.super$update(tile);
      const awaypos=this.getawaypos(tile.x,tile.y,tile.rotation());
      const akey=awaypos.x+","+awaypos.y;
      if(commandblocksc.hasOwnProperty(akey)&&commandblocksc[akey].didsuccess){
        //if(Core.input.keyDown(KeyCode.F12)) return;
        var res=commandblocksc.command(tile,entity.message,this,entity.message,false);
        thiscmd.didsuccess = Boolean(res);
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
  },
  removed(tile){
    this.super$removed(tile);
    var key=tile.x+","+tile.y;
    delete commandblocksc[key];
  },
  handleDamage(tile,amount){
    return 0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0);
  }
});

commandblockchained.entityType=prov(()=>extendContent(MessageBlock.MessageBlockEntity,commandblockchained,{
  config(){
    return this.message;
  }
}));
