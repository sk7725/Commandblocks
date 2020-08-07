//이런 영감 아저씨
if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}

function drawSpark(x, y, size, width, r){
  Drawf.tri(x, y, width, size, r);
  Drawf.tri(x, y, width, size, r+180);
  Drawf.tri(x, y, width, size, r+90);
  Drawf.tri(x, y, width, size, r+270);
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
  Lines.stroke(e.fout()*2.5);
  var v1 = Vec2(e.fin()*7,0).setAngle(e.rotation+180);
  Lines.circle(e.x+v1.x, e.y+v1.y, e.fin()*35);
  Lines.stroke(e.fout()*1.5);
  Draw.color(Color.white);
  Angles.randLenVectors(e.id, 6, 20*e.finpow(), e.rotation, 120, floatc2((x,y) => {
    Lines.lineAngle(e.x+x, e.y+y, Mathf.angle(x, y), 1+e.fout()*6);
  }));
  Draw.color(Pal.surge);
  Angles.randLenVectors(e.id, 1, 15, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*3, e.finpow()*15+20, e.finpow()*-78);
  }));
  Draw.color(Pal.lancerLaser);
  Angles.randLenVectors(e.id, 1, 3, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*4.5, e.finpow()*25+25, e.finpow()*67);
  }));
});

const undyne2 = extendContent(PowerTurret, "undyne2", {
  shoot(tile, type){
    tile.ent().recoil = this.recoil;
    const n = this.shots/2-0.5;
    for(var i=0; i<n; i++){
      Time.run(8*i,run(()=>{
        this.shootSingle(tile);
      }));
    }
    this.tr.trns(tile.ent().rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
    this.effects(tile);
  },
  shootSingle(tile){
    if(!(tile.ent() instanceof Turret.TurretEntity)) return;
    var entity = tile.ent();
    entity.heat = 1;
    this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2, Mathf.range(this.xRand));
    this.spearSingle(tile, entity);
    this.useAmmo(tile);
  },
  spearSingle(tile, entity){
    this.bullet(tile, this.shootType, entity.rotation + Mathf.range(this.inaccuracy));
    this.bullet(tile, this.shootType2, entity.rotation + Mathf.range(this.inaccuracy));
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.damage);
    this.stats.add(BlockStat.damage, "{0} / {1}", this.shootType.damage, this.shootType2.damage);
  }
});
undyne2.shootEffect = undyneShoot2;
undyne2.shootType = this.global.bullets.spear;
undyne2.shootType2 = this.global.bullets.spear2;


const fesShoot = newEffect(25, e => {
  Draw.color(Pal.accent);
  Lines.stroke(e.fout()*5);
  Lines.circle(e.x, e.y, e.fin()*10);
  Draw.color(Pal.accent, Color.green, e.fin());
  Angles.randLenVectors(e.id, 3, 30*e.finpow(), e.rotation, 40, floatc2((x,y) => {
    Fill.circle(e.x+x, e.y+y, e.fout()*3);
  }));
  Draw.color(Pal.accent, Color.yellow, e.fin());
  Angles.randLenVectors(e.id, 2, 30*e.finpow(), e.rotation, 40, floatc2((x,y) => {
    Fill.circle(e.x+x, e.y+y, e.fout()*2.5);
  }));
});
const fes90 = newEffect(90, e => {
  Draw.color(Pal.accent);
  Fill.circle(e.x, e.y, e.fin()*7);
  Draw.color(Color.white);
  Fill.circle(e.x, e.y, e.fin()*5.5);
});
const fes45 = newEffect(45, e => {
  Draw.color(Pal.accent);
  Fill.circle(e.x, e.y, e.fin()*7);
  Draw.color(Color.white);
  Fill.circle(e.x, e.y, e.fin()*5.5);
});
const fes10 = newEffect(10, e => {
  Draw.color(Pal.accent);
  Fill.circle(e.x, e.y, e.fin()*7);
  Draw.color(Color.white);
  Fill.circle(e.x, e.y, e.fin()*5.5);
});
const fesCharge = newEffect(15, e => {
  Draw.color(Pal.accent);
  Angles.randLenVectors(e.id, 1, 30*e.fout(), floatc2((x,y) => {
    Fill.circle(e.x+x, e.y+y, e.finpow());
  }));
});

const festival = extendContent(ChargeTurret, "festival", {
  shoot(tile, ammo){
    entity = tile.ent();
    var real = this.reload/this.baseReloadSpeed(tile);
    var realclamp = this.getClamp(real);
    this.useAmmo(tile);
    this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2);
    Effects.effect(this["chargeBeginEffect"+realclamp], tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation);
    for(var i = 0; i < this.chargeEffects; i++){
      Time.run(Mathf.random(realclamp), run(() => {
        entity = tile.ent();
        if(!this.isTurret(tile)) return;
        this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2);
        Effects.effect(this.chargeEffect, tile.drawx() + this.tr.x, tile.drawy() + this.tr.y, entity.rotation);
      }));
    }
    entity.shooting = true;
    Time.run(realclamp, run(() => {
      entity = tile.ent();
      if(!this.isTurret(tile)) return;
      this.tr.trns(entity.rotation, this.size * Vars.tilesize / 2);
      entity.recoil = this.recoil;
      entity.heat = 1;
      this.bullet(tile, ammo, entity.rotation + Mathf.range(this.inaccuracy));
      this.effects(tile);
      entity.shooting = false;
    }));
  },
  getClamp(n){
    if(n>90) return 90;
    if(n>45) return 45;
    return 10;
  },
  baseReloadSpeed(tile){
    return tile.ent().power.status*((tile.ent().power.graph.getLastPowerProduced() - tile.ent().power.graph.getLastPowerNeeded())/50 + 1);
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.reload);
    this.stats.add(BlockStat.reload, "{0} ~ {1}", 0.23, 60);
  },
  setBars(){
		this.super$setBars();
		this.bars.add(
			"reload", func(entity => {
				return new Bar(
					prov(() => Math.min((60/(this.reload/this.baseReloadSpeed(entity.tile))).toFixed(2),60) + " " + Core.bundle.get("blocks.reload")),
					prov(() => Pal.accent),
					floatp(() => {
						return (60/(this.reload/this.baseReloadSpeed(entity.tile)))/60;
					})
				)
			})
		);
	}
});
festival.shootEffect = fesShoot;
festival.chargeBeginEffect90 = fes90;
festival.chargeBeginEffect45 = fes45;
festival.chargeBeginEffect10 = fes10;
festival.chargeEffect = fesCharge;
festival.shootType = this.global.bullets.ball;
