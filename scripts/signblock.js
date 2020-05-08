const signblock = extendContent(MessageBlock, "signblock", {
  tapped(tile,player){
    if((!tile.entity.cons.valid())&&tile.ent().message!=""){
      if(player==Vars.player){
        Vars.ui.showInfo(tile.ent().message);
        print("Sign:shown");
      }
      print("Sign:tapped");
    }
  },
  update(tile){
    if((!tile.entity.cons.valid())&&tile.ent().message!=""){
      if(this.configurable) this.configurable=false;
    }
    else{
      if(!this.configurable) this.configurable=true;
    }
  }
});
