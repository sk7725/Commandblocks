const signblock = extendContent(MessageBlock, "signblock", {
  tapped(tile,player){
    if(!tile.entity.cons.valid()&&player==Vars.player){
      Vars.ui.showInfo(tile.ent().message);
    }
  }
});
