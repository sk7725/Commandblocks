const presstick=50; const timerid=0;
const buttonbig = extendContent(Block, "buttonbig", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  tapped(tile,player){
    tile.ent().timer.reset(timerid,0);
    Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  },
/*
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
*/
  getPowerProduction(tile){
  return (tile.ent().timer.check(timerid,presstick)) ? 0: 6;
  }
});
//print("big!");
