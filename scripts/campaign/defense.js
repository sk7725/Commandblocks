const mendDome = extendContent(MendProjector, "mend-dome", {});

const overDome = extendContent(OverdriveProjector, "overdrive-dome", {
  _heat: [],
  _phase: [],
  draw(tile){
    Draw.rect(this.region, tile.drawx(), tile.drawy());

    var entity = tile.ent();
    var f = 1 - (Time.time() / 100) % 1;

    Draw.color(this.baseColor, this.phaseColor, this._phase[tile.pos()]);
    Draw.alpha(this._heat[tile.pos()] * Mathf.absin(Time.time(), 10, 1) * 0.5);
    //Draw.blend(Blending.additive);
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    //Draw.blend();

    Draw.alpha(1);
    Lines.stroke((2 * f + 0.2) * this._heat[tile.pos()]);
    Lines.square(tile.drawx(), tile.drawy(), ((1 - f) * 8) * this.size / 2);

    Draw.reset();
  },
  placed(tile){
    this.super$placed(tile);
    this._heat[tile.pos()] = 0;
    this._phase[tile.pos()] = 0;
  },
  update(tile){
    this.super$update(tile);
    if(this._heat[tile.pos()] == undefined) this._heat[tile.pos()] = 0;
    if(this._phase[tile.pos()] == undefined) this._phase[tile.pos()] = 0;
    this._heat[tile.pos()] = Mathf.lerpDelta(this._heat[tile.pos()], (tile.ent().cons.valid() || tile.isEnemyCheat())? 1 : 0, 0.08);
    this._phase[tile.pos()] = Mathf.lerpDelta(this._phase[tile.pos()], Mathf.num(tile.ent().cons.optionalValid()), 0.1);
  }
});
/*
overDome.entityType = prov(() => extend(OverdriveProjector.OverdriveEntity, {
  _heat: 0,
  _phase: 0,
  getHeat(){
    return this._heat;
  },
  setHeat(a){
    this._heat = a;
  },
  getPhaseHeat(){
    return this._phase;
  },
  setPhaseHeat(a){
    this._phase = a;
  }
}));*/

/*
const rageZone = this.global.bullets.rageZone;
const rageDome = extendContent(MendProjector, "rage-dome", {
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.repairTime);
  },
  update(tile){
    var entity = tile.ent();
    //if(entity.phaseHeat == undefined) entity.phaseHeat = 0;//wtf
    entity.heat = Mathf.lerpDelta(entity.heat, (entity.cons.valid() || tile.isEnemyCheat())? 1 : 0, 0.08);
    entity.charge += entity.heat * entity.delta();

    //entity.phaseHeat = Mathf.lerpDelta(entity.phaseHeat, Mathf.num(entity.cons.optionalValid()), 0.1);

    if(entity.cons.optionalValid() && entity.timer.get(this.timerUse, this.useTime) && entity.efficiency() > 0){
      entity.cons.trigger();
    }

    if(entity.charge >= this.reload){
      entity.charge = 0;
      Bullet.create(rageZone, null, tile.getTeam(), tile.worldx(), tile.worldy(), 0, 1, 1);
    }
  }
});
*/
