const customb = this.global.bullets;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;
const shader = this.global.shaders.bittunit;

const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");

if(typeof(PixmapTextureData1) == "undefined"){
  const PixmapTextureData1 = Packages.arc.graphics.gl.PixmapTextureData;
}

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
  const blacklist = ["UnitType", "weapon", "create", "displayInfo", "load", "getContentType", "name", "localizedName", "description", "constructor", "typeID", "id", "icon", "createIcons"];
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

function createUnit(name, cbullet, type, obj, notCreate){
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
      Core.app.post(run(() => {
        this.loadIcons();
      }));
    },
    displayInfo(table){
      table.table(cons(title => {
        title.addImage(this.icon(Cicon.xlarge)).size(8 * 6);
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
    },
    setTexture(pixmap, pname){
      this.pixmap = pixmap;
      const texture = new Texture(new PixmapTextureData1(pixmap, null, true, false, true));
      const item = this;
      Core.app.post(run(() => {
        item.iconRegion = Core.atlas.addRegion(pname, new TextureRegion(texture));
      }));
    },
    getTexture(){
      return this.pixmap;
    },
    loadIcons(){
      print("Create Icon: "+"unit-" + this.name);
      // Code below by DeltaNedas, modified by sk7725.
      //this.super$createIcons(packer);

      // Get the unit mask.
      var mask = Core.atlas.getPixmap(origtype.icon(Cicon.full));
      var w = mask.width;
      var h = mask.height;

      // Colour the mask, pixel by pixel
      var newTexture = new Pixmap(w, h);
      var pixel = new Color(), x, y;
      var color = new Color();
      for(x = 0; x < w; x++){
        for(y = 0; y < h; y++){
          pixel.set(mask.getPixel(x, y));
          if(pixel.a > 0){
            if(!(Mathf.equal(pixel.r, pixel.b, 0.1) && Mathf.equal(pixel.g, pixel.b, 0.1) && Mathf.equal(pixel.r, pixel.g, 0.1))){
              color.set(bitcolor1).lerp(bitcolor2, Mathf.sin(x*0.2 + y*0.2));
              pixel.grays(pixel.g*1.3);
              pixel.lerp(color, 0.7);
            }
            newTexture.draw(x, y, pixel);
          }
        }
      }
      // Add it to the atlas
      //packer.add(MultiPacker.PageType.main, "unit-" + this.name, newTexture);
      this.setTexture(newTexture, "unit-" + this.name);
    },
    icon(icon){
      return this.iconRegion;
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

  if(!notCreate){
    if((typeof obj.draw) != "function"){
        obj.draw = function(){
        Draw.shader(shader);
        this.super$draw();
        Draw.shader();
      };
    }
    if((typeof obj.drawShadow) != "function"){
        obj.drawShadow = function(offsetX, offsetY){
        Draw.rect(origtype.icon(Cicon.full), this.x + offsetX, this.y + offsetY, this.rotation - 90);
      };
    }
    var unitmain = prov(()=>{
      main = extend(type, obj);
      //if(runc != undefined) runc.get(main);
      return main;
    });

    unittype.create(unitmain);
  }

  if(Vars.headless) return unittype;
  unittype.localizedName = Core.bundle.format("unit.level2", origtype.localizedName);
  if(origtype.description) unittype.description = origtype.description.split(".")[0] + ".\n"+ Core.bundle.get("unit.level2.description");
  return unittype;
}

this.global.upgradeUnits = {};

const dagger2 = createUnit("dagger", "lightning", GroundUnit, {});
dagger2.weapon.shootSound = Sounds.spark;
dagger2.health = 700;
this.global.upgradeUnits.dagger = dagger2;

const crawler2 = createUnit("crawler", "japok", GroundUnit, {
  damage(amount){
    this.super$damage(amount);
    if(!this.isDead()){
      this.teleport();
    }
  },
  teleport(){
    //var tx = Angles.trnsx(this.rotation - 90, Mathf.randomSeed(this.id + Time.time(), 64) - 32, -Mathf.randomSeed(this.id + Time.time() + 1, 80));
    //var ty = Angles.trnsy(this.rotation - 90, Mathf.randomSeed(this.id + Time.time(), 64) - 32, -Mathf.randomSeed(this.id + Time.time() + 1, 80));
    var v1 = Vec2(89, 0).setAngle(Mathf.randomSeed((this.tileOn() == null)?628:this.tileOn().pos())*360);
    if(Vars.world.tileWorld(this.x+v1.x, this.y+v1.y) == null || Vars.world.tileWorld(this.x+v1.x, this.y+v1.y).solid()) return;
    Effects.effect(Fx.teleportOut, Color.valueOf("f4ba6e"), this.getX(), this.getY());
    Sounds.windowHide.at(this.getX(), this.getY(), 2+Math.random());
    this.setNet(this.x + v1.x, this.y + v1.y);
    Core.app.post(run(()=>{
      Effects.effect(Fx.teleport, Color.valueOf("f4ba6e"), this.getX(), this.getY());
    }));
    //Effects.effect(Fx.teleport, Color.valueOf("f4ba6e"), this.getX(), this.getY());
  }
});
crawler2.health = 300;
this.global.upgradeUnits.crawler = crawler2;

var t = this;

const titan2 = createUnit("titan", "artilleryHoming", GroundUnit, {}, true);
titan2.weapon.shootSound = Sounds.artillery;
titan2.health = 1000;
const titanMain = prov(() => {
  titanMainB = extend(GroundUnit, {
    hitShield(){
      //if(this._hitShield == undefined) this._hitShield = 0;
      return this._hitShield;
    },
    subHit(a){
      this._hitShield -= a;
    },
    setHit(a){
      this._hitShield = a;
    },
    getBuild(){
      return this._buildup;
    },
    addBuild(a){
      this._buildup += a;
    },
    setBuild(a){
      this._buildup = a;
    },
    isShielded(){
      return this._shielded;
    },
    setShielded(a){
      this._shielded = a;
    },
    radScl(){
      return this._radscl;
    },
    setScl(a){
      this._radscl = a;
    },
    drawShield(){
      Draw.color(Pal.accent);
      Fill.poly(this.x, this.y, 6, this.realRadius());
      Draw.color();
    },
    drawShieldOver(){
      if(this.hitShield() <= 0) return;

      Draw.color(Color.white);
      Draw.alpha(this.hitShield());
      Fill.poly(this.x, this.y, 6, this.realRadius());
      Draw.color();
    },
    drawSimple(){
      if(this.realRadius() < 0.5) return;

      var rad = this.realRadius();

      Draw.color(Pal.accent);
      Lines.stroke(1.5);
      Draw.alpha(0.09 + 0.08 * this.hitShield());
      Fill.poly(this.x, this.y, 6, rad);
      Draw.alpha(1);
      Lines.poly(this.x, this.y, 6, rad);
      Draw.reset();
    },
    realRadius(){
      return 70 * this.radScl();
    },
    updateShield(){
      if(!this.isValid() || this.isDead()) return;
      this.setScl(Mathf.lerpDelta(this.radScl(), (this.isShielded())?1:0, 0.05));
      if(!this.isShielded()){
        this.addBuild(-1*((this.hasEffect(StatusEffects.overdrive))?3.5:1.7)*Time.delta());
        if(this.getBuild() <= 0.0001){
          this.setShielded(true);
          this.setBuild(0);
        }
        return;
      }

      if(this.getBuild() >= 900){
        Effects.effect(Fx.shieldBreak, this.x, this.y, 70);
        this.setShielded(false);
        return;
        //b.remove();
      }

      if(this.hitShield() > 0){
        this.subHit(1 / 5 * Time.delta());
      }

      var realRadius = this.realRadius();
      Vars.bulletGroup.intersect(this.x - realRadius, this.y - realRadius, realRadius * 2, realRadius * 2, cons(trait => {
        if(trait.canBeAbsorbed() && trait.getTeam() != this.getTeam() && Intersector.isInsideHexagon(this.x, this.y, 70 * this.radScl() * 2, trait.getX(), trait.getY())){
          trait.absorb();
          Effects.effect(Fx.absorb, trait);
          this.setHit(1);
          this.addBuild(trait.getShieldDamage());
        }
      }));
    },
    update(){
      this.super$update();
      this.updateShield();
    },
    draw(){
      Draw.shader(shader);
      this.super$draw();
      Draw.shader();
      if(this.isValid() && !this.isDead() && this.realRadius() > 0.01) t.global.shieldList.push(this);
    },
    drawSize(){
      return Math.max(this.super$drawSize(), this.realRadius()*2+2);
    }/*
    readSave(stream, version){
      this.super$readSave(stream, version);
      this.readExtra(stream, version);
    },
    read(stream){
      this.super$read(stream,);
      this.readExtra(stream, this.version());
    },
    writeSave(stream){
      this.super$writeSave(stream);
      this.writeExtra(stream);
    },
    write(stream){
      this.super$write(stream);
      this.writeExtra(stream);
    },
    writeExtra(stream){
      //if(net == undefined || net == null) net = false;
      //this.super$writeSave(stream);
      stream.writeBoolean(this.isShielded());
      stream.writeShort(Mathf.floor(this.getBuild()));
      stream.writeShort(Mathf.floor(this.radScl()*100));
    },
    readExtra(stream, version){
      //this.super$readSave(stream, version);
      this.setShielded(stream.readBoolean());
      this.setBuild(stream.readShort());
      this.setScl(stream.readShort()/100);
    }*/
  });
  titanMainB.setHit(0);
  titanMainB.setShielded(true);
  titanMainB.setBuild(0);
  titanMainB.setScl(0);
  return titanMainB;
});
titan2.create(titanMain);
this.global.upgradeUnits.titan = titan2;

const fortress2 = createUnit("fortress", "lancerLaser", GroundUnit, {
  behavior(){
    if(!Units.invalidateTarget(this.target, this)){
      if(this.dst(this.target) < this.getWeapon().bullet.range()){

        this.rotate(this.angleTo(this.target));

        if(Angles.near(this.angleTo(this.target), this.rotation, 13)){
          this.velocity().set(0, 0);
          var ammo = this.getWeapon().bullet;

          var to = Predict.intercept(this, this.target, ammo.speed);

          this.getWeapon().update(this, to.x, to.y);
        }
      }
    }
  }
});
fortress2.weapon.shootSound = Sounds.laser;
fortress2.weapon.reload = 15;
fortress2.health = 16400;
fortress2.speed = 0.17;
fortress2.maxVelocity = 1.2;
this.global.upgradeUnits.fortress = fortress2;

const charging = extendContent(StatusEffect,"charging",{});
charging.color = Pal.accent;
charging.effect = customfx.chargeShine;
charging.speedMultiplier = 0.21;

const eruptor2 = createUnit("eruptor", "standardIncendiaryBig", GroundUnit, {
  behavior(){
    if(this.timer.get(4, 650)){
      this.applyEffect(charging, 120);
      if(!Vars.net.client()){
        Call.createBullet(customb.spawnZone, this.getTeam(), this.getX(), this.getY(), 0, 1, 1);
        for(var i=0; i<15; i++){
          Time.run(i*7+10, run(()=>{
            if(this == null || this.isDead()) return;
            var u = UnitTypes.eruptor.create(this.getTeam());
            var v1 = Vec2(75, 0).setAngle(Mathf.random()*360);
            if(Vars.world.tileWorld(this.x+v1.x, this.y+v1.y) == null || Vars.world.tileWorld(this.x+v1.x, this.y+v1.y).solid()) u.set(this.x, this.y);
            else u.set(this.x+v1.x, this.y+v1.y);
            u.add();
            u.applyEffect(StatusEffects.overdrive, 1000);
          }));
        }
      }
    }
    if(!Units.invalidateTarget(this.target, this)){
      if(this.dst(this.target) < this.getWeapon().bullet.range()){

        this.rotate(this.angleTo(this.target));

        if(Angles.near(this.angleTo(this.target), this.rotation, 13)){
          //this.velocity().set(0, 0);
          var ammo = this.getWeapon().bullet;

          var to = Predict.intercept(this, this.target, ammo.speed);

          this.getWeapon().update(this, to.x, to.y);
        }
      }
    }
  }
});
eruptor2.weapon.shootSound = Sounds.flame;
eruptor2.weapon.reload = 3;
eruptor2.weapon.alternate = true;
eruptor2.health = 12800;
eruptor2.speed = 0.15;
eruptor2.maxVelocity = 0.8;
eruptor2.targetAir = false;
eruptor2.rotatespeed = 0.0055;
this.global.upgradeUnits.eruptor = eruptor2;

const raging = extendContent(StatusEffect, "raging", {
  update(unit, time){
    this.super$update(unit, time);
    if(unit.health() < unit.maxHealth()) unit.healBy(1);
  }
});
raging.color = Color.purple;
raging.effect = customfx.rageShine;
raging.speedMultiplier = 1.6;
raging.damageMultiplier = 2;
const jamweapons = extendContent(StatusEffect,"jamweapons",{
  update(unit, time){
    this.super$update(unit, time);
    unit.getTimer().get(unit.getShootTimer(true),1);
    unit.getTimer().get(unit.getShootTimer(false),1);
  }
});
jamweapons.color = Color.orange;
jamweapons.effect = Fx.none;

const carray2 = createUnit("chaos-array", "standardThoriumBig", GroundUnit, {}, true);
carray2.weapon.shootSound = Sounds.artillery;
carray2.weapon.reload = 30;
carray2.weapon.shots = 5;
carray2.weapon.spacing = 6;
carray2.weapon.alternate = true;
carray2.weapon.lengthRand = 0;
carray2.weapon.shotDelay = 0;
carray2.health = 56000;
carray2.speed = 0.23;
carray2.maxVelocity = 0.99;
carray2.targetAir = true;
const arrayMain = prov(() => {
  arrayMainB = extend(GroundUnit, {
    _timerSkill: new Interval(3),
    skillTimer(){
      return this._timerSkill;
    },
    setRage(a){
      this._rage = a;
    },
    rage(){
      return this._rage;
    },
    setAtkMode(a){
      this._atkmode - a;
    },
    atkMode(){
      return this._atkmode;
    },
    toggleAtk(){
      this._atkmode = !this._atkmode;
    },
    behaviorFull(){
      if(!Vars.net.client()){
        if(this.skillTimer().get(0, 150)){
          Call.createBullet(customb.fragArray, this.getTeam(), this.getX(), this.getY(), this.rotation+180, 1, 1);
        }
      }
    },
    behaviorHalf(){
      if(!Vars.net.client()){
        if(this.atkMode()){
          if(this.skillTimer().get(0, 290)){
            for(var i=0; i<((this.healthf()>0.3)?2:4); i++){
              Tmp.v1.trns(Mathf.random()*360 ,Mathf.random()*40);
              Call.createBullet(customb.burstArray, this.getTeam(), this.getX()+Tmp.v1.x, this.getY()+Tmp.v1.y, Tmp.v1.angle(), 1, 1);
            }
          }
        }
        else{
          if(this.skillTimer().get(0, 140)){
            for(var i=0; i<((this.healthf()>0.3)?3:5); i++){
              Time.run(i*15, run(()=>{
                if(this.isValid() && !this.isDead()) Call.createBullet(customb.fragArray, this.getTeam(), this.getX(), this.getY(), this.rotation+180, 1, 1);
              }));
            }
          }
        }

        //shoot meltdown laser!
        if(this.skillTimer().get(1, 900*this.healthf()+480)){
          this.applyEffect(jamweapons, 230);
          this.applyEffect(charging, 230);
          //var v1 = Vec2(30, 0).setAngle(this.rotation);
          Call.createBullet(customb.meltCharge, this.getTeam(), this.getX(), this.getY(), this.rotation, 1, 1);
        }
        //heal,rage zone
        if(this.skillTimer().get(2, 1321)){
          if(this.atkMode()){
            Call.createBullet(customb.rageZone, this.getTeam(), this.getX(), this.getY(), 0, 1, 1);
          }
          else{
            Call.createBullet(customb.arrayHealZone, this.getTeam(), this.getX(), this.getY(), 0, 1, 1);
          }
          this.toggleAtk();
        }
      }
    },
    doHalf(){
      if(!Vars.net.client()){
        this.applyEffect(raging, 9999999);
        Call.createBullet(customb.rageZone, this.getTeam(), this.getX(), this.getY(), 0, 1, 1);
        this.skillTimer().reset(0, 0);
        //this.skillTimer().reset(1, 0);
        this.skillTimer().reset(2, 0);
        this.setAtkMode(false);
      }
    },
    behavior(){
      if(this.healthf() < 0.65 || this.rage()){
        if(!this.rage()){
          this.doHalf();
          this.setRage(true);
        }
        this.behaviorHalf();
      }
      else{
        this.behaviorFull();
      }
      if(!Units.invalidateTarget(this.target, this)){
        if(this.dst(this.target) < this.getWeapon().bullet.range()){

          this.rotate(this.angleTo(this.target));

          if(Angles.near(this.angleTo(this.target), this.rotation, 13)){
            this.velocity().set(0, 0);
            var ammo = this.getWeapon().bullet;

            var to = Predict.intercept(this, this.target, ammo.speed);

            this.getWeapon().update(this, to.x, to.y);
          }
        }
      }
    },
    draw(){
      Draw.shader(shader);
      this.super$draw();
      Draw.shader();
    }
  });
  //arrayMainB.initTimer(new Interval(4));
  arrayMainB.setRage(false);
  arrayMainB.setAtkMode(false);
  return arrayMainB;
});
carray2.create(arrayMain);
this.global.upgradeUnits["chaos-array"] = carray2;

const erad2 = createUnit("eradicator", "wormSmall", GroundUnit, {});
erad2.weapon.shootSound = Sounds.missile;
erad2.weapon.shots = 2;
erad2.weapon.spacing = 8;
erad2.weapon.alternate = true;
erad2.weapon.lengthRand = 0;
erad2.weapon.shotDelay = 0;
erad2.weapon.velocityRnd = 0.4;
erad2.health = 256000;
this.global.upgradeUnits.eradicator = erad2;

const wraith2 = createUnit("wraith", "grenade", FlyingUnit, {});
wraith2.weapon.shootSound = Sounds.artillery;
wraith2.weapon.reload = 45;
wraith2.health = 560;
wraith2.speed = 0.33;
wraith2.maxVelocity = 2.5;
this.global.upgradeUnits.wraith = wraith2;

/*
Events.on(EventType.WaveEvent, run(event => {
  Core.app.post(run(() => {

  }));
}));
*/
