const customb = this.global.bullets;
const newSounds = this.global.newSounds;
const shader = this.global.shaders.bittrium;

function copyWeapon(orig, target){
  const blacklist = ["minPlayerDist", "sequenceNum", "name", "Weapon", "onPlayerShootWeapon", "onGenericShootWeapon", "shootDirect", "load", "update", "getRecoil", "shoot", "bullet"];
  var arr = Object.keys(orig);
  for(var i=0; i<arr.length; i++){
    if(blacklist.indexOf(arr[i]) > -1) continue;
    try{
      target[arr[i]] = orig[arr[i]];
    }
    catch(err){
      //print("CopyWeapon Err: "+err);
    }
  }
  return target;
}

function copyUnitType(orig, target){
  const blacklist = ["UnitType", "weapon", "create", "displayInfo", "load", "getContentType", "name", "localizedName", "description", "constructor", "typeID"];
  blacklist = blacklist.concat(Object.keys(UnlockableContent));
  var arr = Object.keys(orig);
  for(var i=0; i<arr.length; i++){
    if(blacklist.indexOf(arr[i]) > -1) continue;
    try{
      target[arr[i]] = orig[arr[i]];
    }
    catch(err){
      //print("CopyUnitType Err: "+err);
    }
  }
  return target;
}

function createUnit(name, cbullet, type){
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
    },
    displayInfo(table){
      table.table(cons(title => {
        title.addImage(origtype.icon(Cicon.xlarge)).size(8 * 6);
        title.add("[pink]" + this.localizedName).padLeft(5);
      }));

      table.row();

      table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();

      table.row();

      if(this.description != null){
        table.add(this.displayDescription()).padLeft(5).padRight(5).width(400).wrap().fillX();
        table.row();

        table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
        table.row();
      }

      table.left().defaults().fillX();

      table.add(Core.bundle.format("unit.health", this.health));
      table.row();
      table.add(Core.bundle.format("unit.speed", this.speed.toFixed(1)));
      table.row();
      table.row();
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

  var unitmain = prov(()=>{
    main = extend(type, {
      draw(){
        Draw.shader(shader);
        this.super$draw();
        Draw.shader();
      }
    });
    return main;
  });

  unittype.create(unitmain);

  unittype.localizedName = Core.bundle.format("unit.level2", origtype.localizedName);
  unittype.description = Core.bundle.get("unit."+name+".level2");
  return unittype;
}


const dagger2 = createUnit("dagger", "lightning", GroundUnit);
dagger2.weapon.shootSound = Sounds.spark;
dagger2.health = 700;

const titan2 = createUnit("titan", "spear", GroundUnit);
titan2.weapon.shootSound = Sounds.none;
titan2.health = 2000;

const fortress2 = createUnit("fortress", "lancerLaser", GroundUnit);
fortress2.weapon.shootSound = Sounds.laser;
fortress2.weapon.reload = 15;
fortress2.health = 6400;
fortress2.speed = 0.17;
fortress2.maxVelocity = 1.2;

const wraith2 = createUnit("wraith", "grenade", FlyingUnit);
wraith2.weapon.shootSound = Sounds.artillery;
wraith2.weapon.reload = 45;
wraith2.health = 560;
wraith2.speed = 0.33;
wraith2.maxVelocity = 2.5;
