const colorx = Color.valueOf("ea8878");

const smallx = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout());
  Lines.lineAngleCenter(e.x, e.y, 45, 8);
  Lines.lineAngleCenter(e.x, e.y, 135, 8);
});

const bigx = newEffect(20, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout());
  Lines.lineAngleCenter(e.x, e.y, 45, 16);
  Lines.lineAngleCenter(e.x, e.y, 135, 16);
});

const wallinvi = extendContent(Wall,"wallinvi",{
    handleDamage(tile,amount){
      if(amount > 2) Effects.effect(smallx, Pal.heal, tile.worldx(), tile.worldy());
      return 0.0;
    },
    handleBulletHit(entity,bullet){
      entity.damage(0.0);
      Effects.effect(smallx, colorx, entity.getX(), entity.getY());
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
      if(amount > 2) Effects.effect(bigx, Pal.heal, tile.worldx(), tile.worldy());
      return 0.0;
    },
    handleBulletHit(entity,bullet){
      entity.damage(0.0);
      Effects.effect(bigx, colorx, entity.getX(), entity.getY());
    }
});

wallinvilarge.entityType = prov(() => extend(TileEntity , {
  onDeath(){
    if(this.isDead()) this.setDead(false);
    this.health(this.maxHealth());
  }
}));
