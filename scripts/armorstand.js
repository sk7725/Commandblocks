
const armorstand = extendContent(UnitType, "armorstand", {});
armorstand.create(prov(() => new JavaAdapter(BaseUnit, {
  behavior(){
    //just..stands
  },
  update(){
    this.super$update();
  },
  countsAsEnemy(){
    return false;
  }
})));
this.global.armorstand=armorstand;
