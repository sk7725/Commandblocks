const colorx = Color.valueOf("ea8878");

const smallx = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout()*1.5);
  Lines.lineAngleCenter(e.x, e.y, 45, 8);
  Lines.lineAngleCenter(e.x, e.y, 135, 8);
});

const bigx = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout()*2.5);
  Lines.lineAngleCenter(e.x, e.y, 45, 16);
  Lines.lineAngleCenter(e.x, e.y, 135, 16);
});

const wallinvi = extendContent(Wall,"wallinvi",{
  handleDamage(tile,amount){
    if(amount > 2) Effects.effect(smallx, Pal.heal, tile.drawx(), tile.drawy());
    return 0.0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0.0);
    Effects.effect(smallx, colorx, entity.getX(), entity.getY());
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.health);
    this.stats.add(BlockStat.health, "{0}", Core.bundle.get("stat.infinity"));
  }
});

wallinvi.entityType = prov(() => extend(TileEntity , {
  onDeath(){
    if(this.isDead()) this.setDead(false);
    this.health(this.maxHealth());
  }
}));

const wallinvilarge = extendContent(Wall,"wallinvilarge",{
  handleDamage(tile,amount){
    if(amount > 2) Effects.effect(bigx, Pal.heal, tile.drawx(), tile.drawy());
    return 0.0;
  },
  handleBulletHit(entity,bullet){
    entity.damage(0.0);
    Effects.effect(bigx, colorx, entity.getX(), entity.getY());
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.health);
    this.stats.add(BlockStat.health, "{0}", Core.bundle.get("stat.infinity"));
  }
});

wallinvilarge.entityType = prov(() => extend(TileEntity , {
  onDeath(){
    if(this.isDead()) this.setDead(false);
    this.health(this.maxHealth());
  }
}));
