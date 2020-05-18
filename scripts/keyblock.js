const presstick=1; const timerid=0;
const KeyCode=Packages.arc.input.KeyCode;
const keyblock = extendContent(MessageBlock, "keyblock", {
  placed(tile) {
    this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"Q");
    //tile.ent().timer.reset(timerid,presstick+1);
  },
  drawSelect(tile){
    //kill the words
  },
  draw(tile) {
    //this.super$draw(tile);

    //Draw.rect(Core.atlas.find(this.name + (Core.input.keyDown(KeyCode[message])) ? "":"-trig")), tile.drawx(), tile.drawy());
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    try{
      this.drawPlaceText(tile.ent().message.toUpperCase(),tile.x,tile.y-1,Core.input.keyDown(KeyCode[tile.ent().message.toUpperCase()]));
    }
    catch(err){
      this.drawPlaceText("??",tile.x,tile.y-1,false);
    }

  },
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
    try{
      return (Core.input.keyDown(KeyCode[tile.ent().message.toUpperCase()])) ? 1: 0;
    }
    catch(err){
      //print(err);
      return 0;
    }
  },
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
  }
});
