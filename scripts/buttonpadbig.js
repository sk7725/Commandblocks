const presstick=20; const timerid=0;
const buttonpadbig = extendContent(Block, "buttonpadbig", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick)) Sounds.place.at(tile.worldx(),tile.worldy());
    tile.ent().timer.reset(timerid,0);
  },
  update(tile){
    this.super$update(tile);
    if(Units.anyEntities(tile)) this.unitOn(tile,null);
  },
  getPowerProduction(tile){
  return (tile.ent().timer.check(timerid,presstick)) ? 0: 3;
  }
});
