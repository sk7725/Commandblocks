const presstick=1; const timerid=0;
const KeyCode=Packages.arc.input.KeyCode;
const keyblock = extendContent(MessageBlock, "keyblock", {
  placed(tile) {
    this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"Q");
    //tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    //this.super$draw(tile);

    //Draw.rect(Core.atlas.find(this.name + (Core.input.keyDown(KeyCode[message])) ? "":"-trig")), tile.drawx(), tile.drawy());
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    this.drawPlaceText(tile.ent().message,tile.x,tile.y,tile.ent().timer.check(timerid,presstick));
  },
  setMessageBlockText(player,tile,text){
    text=text.toUpperCase();
    if(!KeyCode.hasOwnProperty(text)) text="ANY_KEY";
    this.super$setMessageBlockText(player,tile,text);
  },
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
    try{
      //return (Core.input.keyDown(KeyCode[tile.ent().message])) ? 3: 0;
      if(Core.input.keyDown(KeyCode[tile.ent().message])){
        tile.ent().timer.reset(timerid,0);
        return 1;
      }
      else return 0;
    }
    catch(err){
      //print(err);
      if(!KeyCode.hasOwnProperty(message)){
        var message=tile.ent().message.toUpperCase();
        if(KeyCode.hasOwnProperty(message)) Call.setMessageBlockText(null,tile,message);
        else Call.setMessageBlockText(null,tile,"ANY_KEY");
      }
      return 0;
    }
  },
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
  }
});
