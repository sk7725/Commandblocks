const presstick=20; const timerid=0; const blocksize=Vars.tilesize*1.9;

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
    if(Math.abs(v.x)>Math.abs(v.y)){
      if(unitv.x*v.x>0) return Vec2(0,0);
      return Vec2(v.x,0);
    }
    if(unitv.y*v.y>0) return Vec2(0,0);
    return Vec2(0,v.y);
  },
  /*
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick/3)){
      Sounds.artillery.at(tile.worldx(),tile.worldy(),2.5);
    }
    tile.ent().timer.reset(timerid,0);
    var entity=tile.ent();
    var dvec=Vec2(unit.x-entity.x,unit.y-entity.y);
    //var dist=dvec.len();
    var originv=unit.velocity().len();
    var avec=this.setvec(dvec,unit.velocity()).scl(1.2*originv,1.2*originv);
    unit.velocity().add(avec.x*Time.delta(),avec.y*Time.delta());
  },
  */
  unitOn(tile,unit){
    if(tile.ent().timer.check(timerid,presstick/3)){
      Sounds.artillery.at(tile.worldx(),tile.worldy(),2.5);
    }
    tile.ent().timer.reset(timerid,0);
    var entity=tile.ent();
    var penX = Math.abs(entity.x - unit.x); var penY = Math.abs(entity.y - unit.y);

    //unit.hitbox(rect2);

    var position = Geometry.raycastRect(
      unit.x - unit.velocity().x*Time.delta(),
      unit.y - unit.velocity().y*Time.delta(),
      unit.x + unit.velocity().x*Time.delta(),
      unit.y + unit.velocity().y*Time.delta(),
      this.rect.setSize(this.size * blocksize + this.rect2.width*2 + this.rect2.height*2).setCenter(entity.x, entity.y)
    );

    if(position != null){
      unit.set(position.x, position.y);
    }

    if(penX > penY){
      unit.velocity().x *= -1;
    }else{
      unit.velocity().y *= -1;
    }
    var avec=Vec2(unit.x-entity.x,unit.y-entity.y);
    avec.scl(2,2);
    unit.velocity().add(avec.x*Time.delta(),avec.y*Time.delta());
  },
  update(tile){
    this.super$update(tile);
    Units.nearby(tile.worldx()-(blocksize-Vars.tilesize)/2,tile.worldy()-(blocksize-Vars.tilesize)/2,blocksize,blocksize,cons(e => {
      this.unitOn(tile,e);
    }));
  },
  load(){
    this.super$load();
    this.rect=new Rect();
    this.rect2=new Rect();
  }
});

slimeblock.maxDamageDeflect=50;
slimeblock.hitTime=20;
