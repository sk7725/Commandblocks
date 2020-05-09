const presstick=4; const timerid=0;
const buttonpad = extendContent(Block, "buttonpad", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick)) Sounds.place.at(tile.worldx(),tile.worldy(),1.2);
    tile.ent().timer.reset(timerid,0);
  },
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
  return (tile.ent().timer.check(timerid,presstick)) ? 0: 3;
  }
});
