const presstick=20; const timerid=0; const blocksize=Vars.tilesize*1.7;

const slimeblock = extendContent(DeflectorWall, "slimeblock", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    var size=Vars.tilesize*2+(tile.ent().timer.check(timerid,presstick)?0:presstick-tile.ent().timer.getTime())*0.2;
    Draw.rect(this.region, tile.drawx(), tile.drawy(),size,size);
    /*
    if(!tile.ent().timer.check(timerid,presstick)){
      Draw.blend(Blending.additive);
      Draw.alpha((presstick-tile.ent().timer.getTime(timerid))/presstick/1.5);
      Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
      Draw.color();
      Draw.blend();
    }
    */
  },
  setvec(v){
    if(Math.abs(v.x)>Math.abs(v.y)){
      return Vec2(v.x,0);
    }
    return Vec2(0,v.y);
  },
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick)){
      Sounds.flame.at(tile.worldx(),tile.worldy(),0.3);
    }
    tile.ent().timer.reset(timerid,0);
    var entity=tile.ent();
    var dvec=Vec2(unit.x-entity.x,unit.y-entity.y);
    var dist=dvec.len();
    var avec=this.setvec(dvec).scl(2*dist,2*dist);
    unit.velocity().add(avec.x*Time.delta(),avec.y*Time.delta());
  },
  update(tile){
    this.super$update(tile);
    Units.nearby(tile.worldx(),tile.worldy(),blocksize,blocksize,cons(e => {
      this.unitOn(tile,e);
    }));
  }
});

slimeblock.maxDamageDeflect=50;
slimeblock.hitTime=20;
