
const armorstand = extendContent(UnitType, "armorstand", {
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
    this.shadowRegion=Core.atlas.find(this.name+"-shadow");
    this.topRegion=Core.atlas.find(this.name+"-top");
  }
});

armorstand.create(prov(() => new JavaAdapter(BaseUnit, {
  behavior(){
    //just..stands
  },
  update(){
    this.super$update();
  },
  countsAsEnemy(){
    return false;
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
    Draw.color();
    Draw.rect(this.type.shadowRegion, this.x, this.y-4);
  }
})));
this.global.armorstand=armorstand;
