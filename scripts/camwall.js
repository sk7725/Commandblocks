const placetick=80; const showtick=60; const showdelay=300; const placeid=0; const showid=1;
var nearplaced=false;
const camwall = extendContent(Block, "camwall", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(placeid,0);
    tile.ent().timer.reset(showid,0);
    nearplaced=true;
  },
  draw(tile) {
    if(nearplaced) tile.ent().timer.reset(showid,0);
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,placetick-tile.ent().timer.getTime(placeid))/placetick));
    Draw.rect(Core.atlas.find(this.name), tile.drawx(), tile.drawy());
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,Math.min(showtick,showdelay+showtick-tile.ent().timer.getTime(showid)))/showtick));
    Draw.rect(Core.atlas.find(this.name+"-top"), tile.drawx(), tile.drawy());
    Drow.color();
    if(nearplaced) nearplaced=false;
  }
});
