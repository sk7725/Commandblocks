const signblock = extendContent(MessageBlock, "signblock", {
  tapped(tile,player){
    if((!tile.entity.cons.valid())&&tile.ent().message!=""){
      if(player==Vars.player){
        Vars.ui.showInfo(tile.ent().message);
        print("Sign:shown");
      }
      print("Sign:tapped");
    }
  }
});
