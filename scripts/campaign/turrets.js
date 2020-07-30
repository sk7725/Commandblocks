//이런 영감 아저씨
if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}

const undyneShoot = newEffect(25, e => {
Draw.color(Pal.lancerLaser, Color.white, e.fout());
  Lines.stroke(e.fout());
  var v1 = Vec2(e.fin()*4,0).setAngle(e.rotation+180);
  Lines.circle(e.x+v1.x, e.y+v1.y, e.fin()*25);
  Lines.stroke(e.fout()*1.5);
  Draw.color(Color.white);
  Angles.randLenVectors(e.id, 6, 20*e.finpow(), e.rotation, 50, floatc2((x,y) => {
    Lines.lineAngle(e.x+x, e.y+y, Mathf.angle(x, y), 1+e.fout()*4);
  }));
});

const undyne = extendContent(PowerTurret, "undyne", {});
undyne.shootEffect = undyneShoot;
undyne.shootType = this.global.bullets.spear;


const undyneShoot2 = newEffect(30, e => {
  Draw.color(Pal.lancerLaser, Color.white, e.fout());
  Lines.stroke(e.fout()*2);
  var v1 = Vec2(e.fin()*7,0).setAngle(e.rotation+180);
  Lines.circle(e.x+v1.x, e.y+v1.y, e.fin()*29);
  Lines.stroke(e.fout()*1.5);
  Draw.color(Color.white);
  Angles.randLenVectors(e.id, 6, 20*e.finpow(), e.rotation, 120, floatc2((x,y) => {
    Lines.lineAngle(e.x+x, e.y+y, Mathf.angle(x, y), 1+e.fout()*6);
  }));
  Draw.color(Pal.surge);
  Angles.randLenVectors(e.id, 1, 15, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*3, e.finpow()*15+10, e.finpow()*-78);
  }));
  Draw.color(Pal.lancerLaser);
  Angles.randLenVectors(e.id, 1, 3, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*4.5, e.finpow()*20+20, e.finpow()*67);
  }));
});

const undyne2 = extendContent(PowerTurret, "undyne2", {
  shoot(tile, type){
    tile.ent().recoil = this.recoil;
    const n = this.shots/2-0.5;
    for(var i=0; i<n; i++){
      Time.run(5*i,run(()=>{
        this.shootSingle(tile);
      }));
    }
    this.effects(tile);
  },
  shootSingle(tile){
    if(!(tile.ent() instanceof TurretEntity)) return;
    var entity = tile.ent();
    entity.heat = 1;
    this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
    this.spearSingle(tile, entity);
    this.useAmmo(tile);
  },
  spearSingle(tile, entity){
    this.bullet(tile, this.shootType, entity.rotation + Mathf.range(this.inaccuracy));
    this.bullet(tile, this.shootType2, entity.rotation + Mathf.range(this.inaccuracy));
  }
});
undyne2.shootEffect = undyneShoot2;
undyne2.shootType = this.global.bullets.spear;
undyne2.shootType2 = this.global.bullets.spear2;
