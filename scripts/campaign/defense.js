const mendDome = extendContent(MendProjector, "mend-dome", {});

const overDome = extendContent(MendProjector, "overdrive-dome", {
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());

    var entity = tile.ent();
    var f = 1 - (Time.time() / 100) % 1;

    if(entity.phaseHeat == undefined) entity.phaseHeat = 0;//wtf
    Draw.color(this.baseColor, this.phaseColor, entity.phaseHeat);
    Draw.alpha(entity.heat * Mathf.absin(Time.time(), 10, 1) * 0.5);
    //Draw.blend(Blending.additive);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    //Draw.blend();

    Draw.alpha(1);
    Lines.stroke((2 * f + 0.2) * entity.heat);
    Lines.square(tile.drawx(), tile.drawy(), ((1 - f) * 8) * this.size / 2);

    Draw.reset();
  }
});

const rageZone = this.global.bullets.rageZone;
const rageDome = extendContent(MendProjector, "rage-dome", {
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.repairTime);
  },
  update(tile){
    var entity = tile.ent();
    if(entity.phaseHeat == undefined) entity.phaseHeat = 0;//wtf
    entity.heat = Mathf.lerpDelta(entity.heat, (entity.cons.valid() || tile.isEnemyCheat())? 1 : 0, 0.08);
    entity.charge += entity.heat * entity.delta();

    entity.phaseHeat = Mathf.lerpDelta(entity.phaseHeat, Mathf.num(entity.cons.optionalValid()), 0.1);

    if(entity.cons.optionalValid() && entity.timer.get(this.timerUse, this.useTime) && entity.efficiency() > 0){
      entity.cons.trigger();
    }

    if(entity.charge >= this.reload){
      entity.charge = 0;
      Bullet.create(rageZone, null, tile.getTeam(), tile.worldx(), tile.worldy(), 0, 1, 1);
    }
  }
});
