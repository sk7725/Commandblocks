const presstick=4; const timerid=0;
const KeyCode=Packages.arc.input.KeyCode;
const keyblock = extendContent(MessageBlock, "keyblock", {
  placed(tile) {
    this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"Q");
    //tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    this.super$draw(tile);
    //Draw.rect(Core.atlas.find(this.name + (Core.input.keyDown(KeyCode[message])) ? "":"-trig")), tile.drawx(), tile.drawy());
    this.drawPlaceText(tile.ent().message,tile.x,tile.y,Core.input.keyDown(KeyCode[tile.ent().message]));
  },
  setMessageBlockText(player,tile,text){
    if(!KeyCode.hasOwnProperty(text)) text="ANY_KEY";
    this.super$setMessageBlockText(player,tile,text.toUpperCase());
  },
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
    try{
      return (Core.input.keyDown(KeyCode[tile.ent().message])) ? 3: 0;
    }
    catch(err){
      print(err);
      return 0;
    }
  },
});
