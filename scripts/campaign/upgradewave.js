const customb = this.global.bullets;

function copyWeapon(orig, target){
  const blacklist = ["minPlayerDist", "sequenceNum", "name", "Weapon", "onPlayerShootWeapon", "onGenericShootWeapon", "shootDirect", "load", "update", "getRecoil", "shoot", "bullet"];
  var arr = Object.keys(orig);
  for(var i=0; i<arr.length; i++){
    if(blacklist.indexOf(arr[i]) > -1) continue;
    try{
      target[arr[i]] = orig[arr[i]];
    }
    catch(err){
      print("CopyWeapon Err: "+err);
    }
  }
  return target;
}

function copyUnitType(orig, target){
  const blacklist = ["UnitType", "weapon", "create", "displayInfo", "load", "getContentType", "name", "localizedName", "description"];
  blacklist = blacklist.concat(Object.keys(UnlockableContent));
  var arr = Object.keys(orig);
  for(var i=0; i<arr.length; i++){
    if(blacklist.indexOf(arr[i]) > -1) continue;
    try{
      target[arr[i]] = orig[arr[i]];
    }
    catch(err){
      print("CopyUnitType Err: "+err);
    }
  }
  return target;
}

function createUnit(name, cbullet){
  const origtype = Vars.content.getByName(ContentType.unit, name);
  if(origtype == null){
    print("Err: "+name+" not found!");
    return;
  }
  var unittype = extendContent(UnitType, name+"-2", {
    load(){
      //this.super$load();
      this.weapon.load();
      this.region = Core.atlas.find(name);
      this.baseRegion = Core.atlas.find(name + "-base");
      this.legRegion = Core.atlas.find(name + "-leg");
    }
  });
  unittype = copyUnitType(origtype, unittype);
  unittype.weapon = extendContent(Weapon, name+"-2-equip", {
    load(){
      this.region = Core.atlas.find(origtype.weapon.name + "-equip", Core.atlas.find(origtype.weapon.name, Core.atlas.find("clear")));
    }
  });

  unittype.weapon = copyWeapon(origtype.weapon, unittype.weapon);
  try{
    unittype.weapon.bullet = (customb.hasOwnProperty(cbullet))?customb[cbullet]:Bullets[cbullet];
  }
  catch(err){
    print("Err: "+cbullet+" not found!");
    unittype.weapon.bullet = Bullets.waterShot;
  }

  unittype.localizedName = Core.bundle.format("unit.level2", origtype.localizedName);
  unittype.description = Core.bundle.get("unit."+name+".level2");
  return unittype;
}


const dagger2 = createUnit("dagger", "arc");
dagger2.health = 300;

const fortress2 = createUnit("fortress", "lancerLaser");
fortress2.health = 1200;
fortress2.speed = 0.17;
fortress2.maxVelocity = 1.2;
