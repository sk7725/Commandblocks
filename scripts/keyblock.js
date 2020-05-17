const presstick=4; const timerid=0;
const keyblock = extendContent(MessageBlock, "keyblock", {
  placed(tile) {
    this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"q");
    //tile.ent().timer.reset(timerid,presstick+1);
  },
  /*
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  */
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
    try{
      return (Core.input.keyDown(Binding.KeyCode[tile.ent().message])) ? 3: 0;
    }
    catch(err){
      print(err);
      return 0.1;
    }
  }
});
