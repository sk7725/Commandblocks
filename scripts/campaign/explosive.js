const presstick=140; const timerid=0;
const explosive = extendContent(Block, "explosive", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    this.super$draw(tile);
    //Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  tapped(tile,player){
    tile.ent().timer.reset(timerid, 0);
    tile.ent().lit();
    //Sounds.click.at(tile.worldx(),tile.worldy());
  },
  update(tile){
    if(tile.ent().fuse()) this.updateFuse(tile);
    else if(tile.ent().cons.valid){
      tile.ent().timer.reset(timerid, 0);
      tile.ent().lit();
    }
  },
  updateFuse(tile){
  }
});
