const placetick=80; const showtick=60; const showdelay=300; const placeid=0; const showid=1;
this.global.camwall=-1*(showtick+showdelay);
var nearplaced=this.global.camwall;
var t=this;
const camwall = extendContent(Block, "camwall", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(placeid,0);
    tile.ent().timer.reset(showid,1);
    t.global.camwall=Time.time();
  },
  draw(tile) {
    //if(nearplaced&&tile.ent().timer.getTime(showid)==0) nearplaced=false;
    //if(nearplaced) tile.ent().timer.reset(showid,0);
    nearplaced=t.global.camwall;
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,placetick-tile.ent().timer.getTime(placeid))/placetick));
    Draw.rect(Core.atlas.find(this.name), tile.drawx(), tile.drawy());
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,Math.min(showtick,showdelay+showtick-(Time.time()-nearplaced)))/showtick));
    Draw.rect(Core.atlas.find(this.name+"-top"), tile.drawx(), tile.drawy());
    Draw.color();
    var cx=Core.camera.position.x; var cy=Core.camera.position.y;
    this.blockcam(tile,cx,cy,tile.worldx(),tile.worldy());
  },
  blockcam(tile,cx,cy,x,y){
    if(y<=cy&&cy<=y+tilesize&&x-tilesize<cx&&cx<=x+tilesize/2){
      Core.camera.position.set(x-tilesize,cy);
    }
    else if(y<=cy&&cy<=y+tilesize&&x+tilesize/2<=cx&&cx<x+2*tilesize){
      Core.camera.position.set(x+2*tilesize,cy);
    }
    else if(x<=cx&&cx<=x+tilesize&&y+tilesize/2<=cy&&cy<y+2*tilesize){
      Core.camera.position.set(cx,y+2*tilesize);
    }
    else if(x<=cx&&cx<=x+tilesize&&cy>y-tilesize&&cy<=y+tilesize/2){
      Core.camera.position.set(cx,y-tilesize);
    }
  }
});
