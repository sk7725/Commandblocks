const presstick=20; const timerid=0;
const button = extendContent(Block, "button", {	
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    Draw.rect(Core.atlas.find(this.name + ((tile.ent().timer.check(timerid,presstick)) ? "":"-trig")), tile.drawx(), tile.drawy()); 
  }, 	
  generateIcons() {
    return [Core.atlas.find(this.name)];
  },
  tapped(tile,player){
    tile.ent().timer.reset(timerid,0);
    Sounds.click.at(tile.worldx(),tile.worldy(),0.4);
  },
  update(tile){
    if(tile.ent().timer.getTime(timerid)==presstick) Sounds.click.at(tile.worldx(),tile.worldy(),0.8);
  }
});
