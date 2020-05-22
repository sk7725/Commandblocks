const presstick=20; const timerid=0; const blocksize=Vars.tilesize*1.7;

const slimeblock = extendContent(DeflectorWall, "slimeblock", {
  placed(tile) {
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile) {
    var size=Vars.tilesize*2+(tile.ent().timer.check(timerid,presstick)?0:presstick-tile.ent().timer.getTime(timerid))*0.2;
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
  setvec(v,unitv){
    if(Math.abs(unitv.x)>Math.abs(unitv.y)){
      if(unitv.x*v.x>0) return Vec2(0,0);
      return Vec2(v.x,0);
    }
    if(unitv.y*v.y>0) return Vec2(0,0);
    return Vec2(0,v.y);
  },
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick)){
      Sounds.artillery.at(tile.worldx(),tile.worldy(),2.5);
    }
    tile.ent().timer.reset(timerid,0);
    var entity=tile.ent();
    var dvec=Vec2(unit.x-entity.x,unit.y-entity.y);
    //var dist=dvec.len();
    var originv=unit.velocity().len();
    var avec=this.setvec(dvec,unit.velocity()).scl(2*originv,2*originv);
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
