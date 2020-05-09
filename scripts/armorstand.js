/*
const noweapon = extendContent(Weapon, "noweapon", {
});

noweapon.reload = 60;
noweapon.alternate = false;
noweapon.length = 0;
noweapon.width = 0;
noweapon.recoil = 0;
noweapon.bullet = Bullets.waterShot;
noweapon.shootSound = Sounds.empty;
noweapon.minPlayerDist = 20;
*/

const armorstand = extendContent(UnitType, "armorstand", {
  load(){
    //this.super$load();
    this.region=Core.atlas.find(this.name);
    this.baseRegion=Core.atlas.find(this.name+"-base");
    this.shadowRegion=Core.atlas.find(this.name+"-shadow");
    this.topRegion=Core.atlas.find(this.name+"-top");
  }
});
armorstand.weapon=UnitTypes.draug.weapon;
armorstand.create(prov(() => new JavaAdapter(GroundUnit, {
  behavior(){
    //just..stands
  },
  targetClosest(){

  },
  update(){
    this.super$update();
  },
  countsAsEnemy(){
    return false;
  },
  drawStats(){
    this.drawBackItems(this.item.amount > 0 ? 1 : 0, false);
    this.drawLight();
  },
  drawShadow(offsetX, offsetY){
    //Draw.rect(getIconRegion(), x + offsetX, y + offsetY, rotation - 90);
    Draw.rect(this.type.shadowRegion, this.x+offsetX, this.y-4+offsetY);
  },
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);

    var floor = this.getFloorOn();
    if(floor.isLiquid){
      Draw.color(Color.white, floor.color, 0.5);
    }
    if(floor.isLiquid){
      Draw.color(Color.white, floor.color, this.drownTime * 0.4);
    }else{
      Draw.color(Color.white);
    }

    Draw.rect(this.type.baseRegion, this.x, this.y, this.rotation - 90);

    Draw.rect(this.type.topRegion, this.x, this.y+2.5);

    Draw.mixcol();
  //  Draw.color();

  }
})));
this.global.armorstand=armorstand;
