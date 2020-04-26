const placetick=80; const showtick=60; const showdelay=300; const placeid=0; const showid=1;
this.global.camwall=-1*(showtick+showdelay);
var nearplaced=this.global.camwall;
var t=this;
var tilesize=Vars.tilesize;
const camwalldir = extendContent(Block, "camwalldir", {
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
    Draw.rect(Core.atlas.find(this.name+"-base"), tile.drawx(), tile.drawy());
    Draw.color(Color.rgb(255,255,255).a(Math.max(0,Math.min(showtick,showdelay+showtick-(Time.time()-nearplaced)))/showtick));
    Draw.rect(Core.atlas.find(this.name+"-"+tile.rotation()), tile.drawx(), tile.drawy());
    Draw.color();
    var cx=Core.camera.position.x; var cy=Core.camera.position.y;
    this.blockcam(tile,cx,cy,tile.worldx(),tile.worldy(),tile.rotation());
  }
  blockcam(tile,cx,cy,x,y,r){
    if(r==0&&y<=cy&&cy<=y+tilesize&&cx<x+2*tilesize){
      Core.camera.position.set(x+2*tilesize,cy);
    }
    else if(r==2&&y<=cy&&cy<=y+tilesize&&cx>x-tilesize){
      Core.camera.position.set(x-tilesize,cy);
    }
    else if(r==1&&x<=cx&&cx<=x+tilesize&&cy<y+2*tilesize){
      Core.camera.position.set(cx,y+2*tilesize);
    }
    else if(r==3&&x<=cx&&cx<=x+tilesize&&cy>y-tilesize){
      Core.camera.position.set(cx,y-tilesize);
    }
  }
});
