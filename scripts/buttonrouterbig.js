const presstick=10; const timerid=0;
const buttonrouterbig = extendContent(Router, "buttonrouterbig", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy());
  },
  update(tile){
    var entity=tile.ent();
    if(tile.entity.items.total()>0) tile.ent().timer.reset(timerid,0);
    this.super$update(tile);
    //Vars.ui.showInfoToast(tile.entity.time,1);
  },
  getPowerProduction(tile){
  return (tile.ent().timer.check(timerid,presstick)) ? 0: 2;
  }
});
