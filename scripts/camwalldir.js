const placetick=80; const showtick=60; const showdelay=300; const placeid=0; const showid=1;
this.global.camwall=-1*(showtick+showdelay);
nearplaced=this.global.camwall;
const camwalldir = extendContent(Block, "camwalldir", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(placeid,0);
    tile.ent().timer.reset(showid,1);
    nearplaced=Time.time();
  },
  draw(tile) {
    //if(nearplaced&&tile.ent().timer.getTime(showid)==0) nearplaced=false;
    //if(nearplaced) tile.ent().timer.reset(showid,0);
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,placetick-tile.ent().timer.getTime(placeid))/placetick));
    Draw.rect(Core.atlas.find(this.name+"-base"), tile.drawx(), tile.drawy());
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,Math.min(showtick,showdelay+showtick-(Time.time()-nearplaced)))/showtick));
    Draw.rect(Core.atlas.find(this.name+"-"+tile.rotation()), tile.drawx(), tile.drawy());
    Draw.color();
  }
});
