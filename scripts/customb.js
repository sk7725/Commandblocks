this.global.bullets = {};

const zetacolor=Color.valueOf("82ffe8");
const gravsuck = newEffect(20, e => {
  Draw.color(zetacolor);
  Lines.stroke(e.fin() * 3);
  Lines.square(e.x, e.y, 1 + e.fout() * 80);
});
const gravstart = newEffect(45, e => {
	if(Time.time()%3<2) return;
  Draw.color(zetacolor);
  Lines.stroke(7*e.fout()+0.001);
	//var sx=e.x+(e.data.x)*e.fout(); var sy=e.y+(e.data.y)*e.fout();
  Lines.square(e.x, e.y, (e.fin()>0.68)?(e.fin()-0.68)*500+5:5 ,(e.fout()*350)%360);
});
const gravityTrap = extend(BasicBulletType,{
	target:[],
	draw(b){

	},
	hit(b,x,y){},
	despawned(b){
		delete this.target[b.id];
	},
	update(b){
		//if(b.time()<45) return;
    if(!b.velocity().isZero(0.0001)) b.velocity(0,0);
		if(Mathf.floorPositive(Time.time())%40==0){
			Effects.effect(gravsuck,b.x,b.y);
			Sounds.message.at(b.x,b.y,0.6);
		}
		var i=0;
		if(this.target[b.id].length<=5){
			Units.nearbyEnemies(b.getTeam(),b.x-80,b.y-80,160,160,cons(u=>{
				if(i>=5||!u.isValid()) return;
				var dst2=Mathf.dst2(u.x,u.y,b.x,b.y);
				if(dst2<80*80&&this.target[b.id][u.id]==null){
					this.target[b.id][u.id]=u;
					i++;
				}
			}))
		};
		for(var i in this.target[b.id]){
			if(this.target[b.id][i]!=null)	this.target[b.id][i].velocity().add((b.x-this.target[b.id][i].x)/3,(b.y-this.target[b.id][i].y)/3);
		}
	},
	init(b){
		if(b==null) return;
		this.target[b.id]=[];
		Effects.effect(gravstart,b.x,b.y);
		Sounds.spray.at(b.x,b.y,0.9);
	}
});
gravityTrap.speed = 0;
gravityTrap.lifetime = 260;
gravityTrap.collidesTiles = false;
gravityTrap.collides = false;
gravityTrap.collidesAir = false;
gravityTrap.keepVelocity = false;
this.global.bullets.gravityTrap = gravityTrap;

//Credits to EyeofDarkness
const arcCharge = newEffect(27, e => {
	Draw.color(Color.valueOf("606571"), Color.valueOf("6c8fc7"), e.fin());
	const hh = new Floatc2({get: function(x, y){
		//Fill.poly(e.x + x, e.y + y, 6, 2 + e.fin() * 11, e.rotation);
		Fill.poly(e.x + x, e.y + y, 6, 1 + Mathf.sin(e.fin() * 3, 1, 2) * 5, e.rotation);
	}});

	Angles.randLenVectors(e.id, 2, e.fout() * 40.0, e.rotation, 135.0, hh);
});
const arcSmokeTwo = newEffect(15, e => {
	const trnsB = new Vec2();

	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	trnsB.trns(e.rotation, e.fin() * (4.6 * 15));
	Fill.poly(e.x + trnsB.x, e.y + trnsB.y, 6, e.fout() * 16, e.rotation);
});
const arcSmoke = newEffect(27, e => {
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	const hl = new Floatc2({get: function(x, y){
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 9, e.rotation);
	}});
	Angles.randLenVectors(e.id, 3, e.finpow() * 20.0, e.rotation, 180.0, hl);
});
const arcCasterBullet = extend(BasicBulletType, {
	update: function(b){
		const trnsC = new Vec2();
		const trnsD = new Vec2();
		if(Mathf.chance(0.9)){
			Effects.effect(arcSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.rot());
		};
		if(Mathf.chance(Time.delta() * 0.5)){
			trnsC.trns(b.rot() + Mathf.range(2.0), 12);
			Lightning.create(b.getTeam(), Color.valueOf("a9d8ff"), 29, b.x + trnsC.x + Mathf.range(12.0), b.y + trnsC.y + Mathf.range(12.0), b.rot() + Mathf.range(46.0), Mathf.random(4, 18));
		};
		if(Mathf.chance(Time.delta() * 0.2)){
			trnsD.trns(b.rot() + Mathf.range(2.0), 12);
			Lightning.create(b.getTeam(), Color.valueOf("8494b3"), 14, b.x + trnsD.x + Mathf.range(12.0), b.y + trnsD.y + Mathf.range(12.0), b.rot() + Mathf.range(180.0), Mathf.random(3, 12));
		};
		Effects.effect(arcSmokeTwo, this.backColor, b.x + Mathf.range(12.0), b.y + Mathf.range(12.0), b.rot() + Mathf.range(2.0));
	},
	draw: function(b){
		Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), b.fin());
		Fill.poly(b.x, b.y, 6, 6 + b.fout() * 6.1, b.rot());
		Draw.reset();
	}
});
arcCasterBullet.speed = 4.4;
arcCasterBullet.damage = 4;
arcCasterBullet.lifetime = 90;
arcCasterBullet.hitSize = 21;
arcCasterBullet.despawnEffect = Fx.none;
arcCasterBullet.shootEffect = Fx.none;
arcCasterBullet.collides = true;
arcCasterBullet.collidesTiles = false;
arcCasterBullet.collidesAir = true;
arcCasterBullet.pierce = true;
this.global.bullets.arcCasterBullet = arcCasterBullet;

const forceSmall = extend(BasicBulletType,{
  breakage:540,
  radius:80,
  radscl:[],
  hit:[],
  buildup:[],
	draw(b){
    if(false && Core.settings.getBool("animatedshields") && Shaders.shield != null){
      Draw.shader(Shaders.shield);
      Draw.color(Pal.accent);
      Fill.poly(b.x, b.y, 6, this.realRadius(b));
      Draw.color();
      this.drawOver(b);
      Draw.shader();
    }
    else{
      this.drawSimple(b);
    }
	},
  drawOver(b){
    if(this.hit[b.id] <= 0) return;

    Draw.color(Color.white);
    Draw.alpha(this.hit[b.id]);
    Fill.poly(b.x, b.y, 6, this.realRadius(b));
    Draw.color();
  },
  drawSimple(b){
    if(this.realRadius(b) < 0.5) return;

    var rad = this.realRadius(b);

    Draw.color(Pal.accent);
    Lines.stroke(1.5);
    Draw.alpha(0.09 + 0.08 * this.hit[b.id]);
    Fill.poly(b.x, b.y, 6, rad);
    Draw.alpha(1);
    Lines.poly(b.x, b.y, 6, rad);
    Draw.reset();
  },
	hit(b,x,y){},
	despawned(b){
		delete this.radscl[b.id];
    delete this.hit[b.id];
    delete this.buildup[b.id];
	},
	update(b){
    try{
      var broken = (this.buildup[b.id] < 0);
      this.radscl[b.id] = Mathf.lerpDelta(this.radscl[b.id], (broken)?0:1, 0.05);

      if(broken){
        if(this.radscl[b.id] <= 0){
          delete this.radscl[b.id];
          delete this.hit[b.id];
          delete this.buildup[b.id];
          b.remove();
        }
        return;
      }
      /*
      if(this.buildup[b.id] > 0 && !broken){
        this.buildup[b.id] -= Time.delta() * 1.75;
        if(this.buildup[b.id] < 0) this.buildup[b.id] = 0;
      }*/

      if(b.lifetime() - b.time() < 75){
        this.buildup[b.id] = -1;
        return;
      }
      if(this.buildup[b.id] >= this.breakage){
        Effects.effect(Fx.shieldBreak, b.x, b.y, this.radius);
        this.buildup[b.id] = -1;
        return;
        //b.remove();
      }

      if(this.hit[b.id] > 0){
          this.hit[b.id] -= 1 / 5 * Time.delta();
      }

      var realRadius = this.realRadius(b);
      Vars.bulletGroup.intersect(b.x - realRadius, b.y - realRadius, realRadius * 2, realRadius * 2, cons(trait => {
        if(trait.canBeAbsorbed() && trait.getTeam() != b.getTeam() && Intersector.isInsideHexagon(b.x, b.y, this.radius * this.radscl[b.id] * 2, trait.getX(), trait.getY())){
          trait.absorb();
          Effects.effect(Fx.absorb, trait);
          this.hit[b.id] = 1;
          this.buildup[b.id] += trait.getShieldDamage();
        }
      }));
    }
    catch(err){
      print(err);
    }
	},
  realRadius(b){
    return this.radius * this.radscl[b.id];
  },
	init(b){
    if(b == null) return;
		this.radscl[b.id] = 0;
    this.hit[b.id] = 0;
    this.buildup[b.id] = 0;
	}
});
forceSmall.speed = 0;
forceSmall.lifetime = 3600;
forceSmall.collidesTiles = false;
forceSmall.collides = false;
forceSmall.collidesAir = false;
forceSmall.keepVelocity = false;
this.global.bullets.forceSmall = forceSmall;

function fillLight(x, y, sides, radius, center, edge){
  var centerf = center.toFloatBits(); var edgef = edge.toFloatBits();
  sides = Mathf.ceil(sides / 2) * 2;
  var space = 360 / sides;

  for(var i = 0; i < sides; i += 2){
    var px = Angles.trnsx(space * i, radius);
    var py = Angles.trnsy(space * i, radius);
    var px2 = Angles.trnsx(space * (i + 1), radius);
    var py2 = Angles.trnsy(space * (i + 1), radius);
    var px3 = Angles.trnsx(space * (i + 2), radius);
    var py3 = Angles.trnsy(space * (i + 2), radius);
    Fill.quad(x, y, centerf, x + px, y + py, edgef, x + px2, y + py2, edgef, x + px3, y + py3, edgef);
  }
}

const zoneStart = newEffect(15, e => {
	fillLight(e.x, e.y, Lines.circleVertices(75), 75, Color.clear, Color.white.cpy().a(e.fout()));
});
const effectZone = extend(BasicBulletType,{
	draw(b){
    if(b.getData() == null) return;
    Draw.color(b.getData().color);
    Lines.stroke(1);
    Lines.circle(b.x, b.y, Mathf.clamp((1-b.fin())*20)*75);
    fillLight(b.x, b.y, Lines.circleVertices(75), Mathf.clamp((1-b.fin())*20)*75, b.getData().color.cpy().a(0), b.getData().color.cpy().a(0.4+0.25*Mathf.sin(b.time()*0.02)));
    Draw.color();
	},
	hit(b,x,y){},
  despawned(b){},
	update(b){
    if(b.getData() == null) return;
    Units.nearby(b.getTeam(), b.x, b.y, 75, cons(e=>{
      e.applyEffect(b.getData(), 2);
    }));
    if(Mathf.chance(0.3)){
      var v1=Vec2(75,0).setAngle(Mathf.random()*360);
      Effects.effect(b.getData().effect,b.x+v1.x,b.y+v1.y);
    }
	},
	init(b){
		if(b == null) return;
    if(!(b.getData() instanceof StatusEffect)) b.setData(null);
    Effects.effect(zoneStart,b.x,b.y);
	}
});
effectZone.speed = 0;
effectZone.lifetime = 500;
effectZone.collidesTiles = false;
effectZone.collides = false;
effectZone.collidesAir = false;
effectZone.keepVelocity = false;
this.global.bullets.effectZone = effectZone;

const healFx = this.global.fx.healFx;
const healSpread = this.global.fx.healSpread;
const healStart = newEffect(15, e => {
	fillLight(e.x, e.y, Lines.circleVertices(50), 50, Color.clear, Color.white.cpy().a(e.fout()));
});
const healZone = extend(BasicBulletType,{
	draw(b){
    Draw.color(Pal.surge);
    Lines.stroke(1);
    Lines.circle(b.x, b.y, Mathf.clamp((1-b.fin())*20)*50);
    fillLight(b.x, b.y, Lines.circleVertices(50), Mathf.clamp((1-b.fin())*20)*50, Pal.surge.cpy().a(0), Pal.surge.cpy().a(0.4+0.25*Mathf.sin(b.time()*0.02)));
    Draw.color();
	},
	hit(b,x,y){},
  despawned(b){},
	update(b){
    Units.nearby(b.getTeam(), b.x, b.y, 50, cons(e=>{
      e.health(Math.min(e.health()+0.5, e.maxHealth()));
      if(Mathf.chance(0.3)) Effects.effect(healSpread,e.getX(),e.getY());
    }));
    if(Mathf.chance(0.3)){
      var v1=Vec2(50,0).setAngle(Mathf.random()*360);
      Effects.effect(healFx,b.x+v1.x,b.y+v1.y);
    }
	},
	init(b){
		if(b == null) return;
    Effects.effect(healStart,b.x,b.y);
	}
});
healZone.speed = 0;
healZone.lifetime = 500;
healZone.collidesTiles = false;
healZone.collides = false;
healZone.collidesAir = false;
healZone.keepVelocity = false;
this.global.bullets.healZone = healZone;

const distcolor = Color.valueOf("4c00ff");
const distortFx = newEffect(18, e => {
	Draw.color(Pal.lancerLaser, distcolor, e.fin());
	Fill.square(e.x, e.y, 0.1 + e.fout() * 2.5, 45);
});
const distSplashFx = newEffect(80, e => {
  Draw.color(Pal.lancerLaser, distcolor, e.fin());
  Lines.stroke(2 * e.fout());
  Lines.circle(e.x, e.y, 85*e.fin());
});
const distort=extendContent(StatusEffect,"distort",{});
distort.speedMultiplier = 0.35;
distort.color = distcolor;
distort.effect = distortFx;
const distStart = newEffect(45, e => {
	fillLight(e.x, e.y, Lines.circleVertices(85), 85, Color.clear, Pal.lancerLaser.cpy().a(e.fout()));
});
const distZone = extend(BasicBulletType,{
	draw(b){
    Draw.color(Pal.lancerLaser);
    Lines.stroke(1);
    Lines.circle(b.x, b.y, Mathf.clamp((1-b.fin())*20)*85);
    fillLight(b.x, b.y, Lines.circleVertices(85), Mathf.clamp((1-b.fin())*20)*85, Pal.lancerLaser.cpy().a(0), distcolor.cpy().a(0.7+0.25*Mathf.sin(b.time()*0.05)));
    Draw.color();
	},
	hit(b,x,y){},
  despawned(b){},
	update(b){
    if(b.time()%80<=1 && b.lifetime() - b.time() > 100) Effects.effect(distSplashFx,b.x,b.y);
    Vars.bulletGroup.intersect(b.x-85, b.y-85, b.x+85, b.y+85, cons(e=>{
      if(Mathf.within(b.x, b.y, e.x, e.y, 85) && e != b && e.getTeam() != b.getTeam() && e != null){
        e.velocity().x = e.velocity().x * 0.915;
        e.velocity().y = e.velocity().y * 0.915;
      }
    }));
    Units.nearbyEnemies(b.getTeam(), b.x-85, b.y-85, b.x+85, b.y+85, cons(e=>{
      if(Mathf.within(b.x, b.y, e.x, e.y, 85) && e != null){
        e.applyEffect(distort, 2);
      }
    }));
	},
	init(b){
		if(b == null) return;
    Effects.effect(distStart,b.x,b.y);
	}
});
distZone.speed = 0;
distZone.lifetime = 897;
distZone.collidesTiles = false;
distZone.collides = false;
distZone.collidesAir = false;
distZone.keepVelocity = false;
this.global.bullets.distZone = distZone;

const shader = this.global.shaders.space;
const whirl = this.global.fx.whirl;
//creditts to EyeofDarkness
const blackhole = extend(BasicBulletType, {
  update(b){
    const v1 = new Vec2();
    const v2 = new Vec2();

    if(Mathf.chance(Time.delta() * (0.3 * b.fout()))){
      Effects.effect(whirl, b.x, b.y, b.fout() * 5.5);
    };

    Units.nearbyEnemies(b.getTeam(), b.x - this.rangeB, b.y - this.rangeB, this.rangeB * 2, this.rangeB * 2, cons(u => {
      if(u != null && Mathf.within(b.x, b.y, u.x, u.y, this.rangeB)){
        if(u instanceof SolidEntity){
          var interp = this.strength * Interpolation.pow2In.apply(b.fout());
          var dst = Math.abs((Mathf.dst(b.x, b.y, u.x, u.y) / this.rangeB) - 1) * interp;
          var ang = Angles.angle(u.x, u.y, b.x, b.y);

          v1.trns(ang, dst);

          u.velocity().add(v1);

          if(u instanceof FlyingUnit){
          	v2.set(v1).scl(0.5);
          	u.velocity().add(v2);
          };

          u.moveBy(v1.x, v1.y);

          //var data = [b, u, interp];

          //Effects.effect(laserEffect, b.x, b.y, 0, data);
        }
      }
    }));
  },

	draw(b){
		Draw.shader(shader);
		Fill.circle(b.x, b.y, b.fout() * 7.5);
    Draw.shader();
		Draw.color(Color.black);
		Fill.circle(b.x, b.y, b.fout() * 5.5);
	}
});
blackhole.strength = 1.6;
blackhole.rangeB = 120;
blackhole.speed = 0;
blackhole.damage = 30;
blackhole.lifetime = 7.5 * 60;
blackhole.pierce = true;
blackhole.bulletWidth = 12;
blackhole.bulletHeight = 12;
blackhole.bulletShrink = 0;
blackhole.hitSize = 12;
blackhole.despawnEffect = Fx.none;
blackhole.keepVelocity = false;
this.global.bullets.blackhole = blackhole;

const whirlSmall = this.global.fx.whirlSmall;
const blackholeSmall = extend(BasicBulletType, {
  update(b){
    const v1 = new Vec2();
    const v2 = new Vec2();

    if(Mathf.chance(Time.delta() * (0.3 * b.fout()))){
      Effects.effect(whirlSmall, b.x, b.y, b.fout() * 2.5);
    };

    Units.nearbyEnemies(b.getTeam(), b.x - this.rangeB, b.y - this.rangeB, this.rangeB * 2, this.rangeB * 2, cons(u => {
      if(u != null && Mathf.within(b.x, b.y, u.x, u.y, this.rangeB)){
        if(u instanceof SolidEntity){
          var interp = this.strength * Interpolation.pow2In.apply(b.fout());
          var dst = Math.abs((Mathf.dst(b.x, b.y, u.x, u.y) / this.rangeB) - 1) * interp;
          var ang = Angles.angle(u.x, u.y, b.x, b.y);

          v1.trns(ang, dst);

          u.velocity().add(v1);

          if(u instanceof FlyingUnit){
          	v2.set(v1).scl(0.5);
          	u.velocity().add(v2);
          };

          u.moveBy(v1.x, v1.y);

          //var data = [b, u, interp];

          //Effects.effect(laserEffect, b.x, b.y, 0, data);
        }
      }
    }));
  },

	draw(b){
		Draw.shader(shader);
		Fill.circle(b.x, b.y, b.fout() * 4.5);
    Draw.shader();
		Draw.color(Color.black);
		Fill.circle(b.x, b.y, b.fout() * 2.5);
	}
});
blackholeSmall.strength = 0.9;
blackholeSmall.rangeB = 40;
blackholeSmall.speed = 0;
blackholeSmall.damage = 8;
blackholeSmall.lifetime = 5 * 60;
blackholeSmall.pierce = true;
blackholeSmall.bulletWidth = 6;
blackholeSmall.bulletHeight = 6;
blackholeSmall.bulletShrink = 0;
blackholeSmall.hitSize = 6;
blackholeSmall.despawnEffect = Fx.none;
blackholeSmall.keepVelocity = false;
this.global.bullets.blackholeSmall = blackholeSmall;

const grenade = extend(BasicBulletType,{
  draw(b){
    var h = -1*b.fin()*(b.fin()-1)*190;
    Draw.color(this.backColor);
    Draw.rect(this.backRegion, b.x, b.y+h, Time.time()*2);
    Draw.color(this.frontColor);
    Draw.rect(this.frontRegion, b.x, b.y+h, Time.time()*2);
    Draw.color();
  },
  //hit(b,x,y){},
  //despawned(b){},
  //update(b){}
});
grenade.speed = 3.2;
grenade.lifetime = 70;
grenade.collidesTiles = false;
grenade.collides = false;
grenade.collidesAir = false;
grenade.keepVelocity = false;
grenade.hitSound = Sounds.explosion;
grenade.splashDamage = 310;
grenade.splashDamageRadius = 40;
grenade.hitShake = 4;
grenade.hitEffect = Fx.flakExplosionBig;
grenade.bulletSprite = "commandblocks-b-grenade";
//grenade.fRegion = Core.atlas.find("commandblocks-b-grenade");
//grenade.bRegion = Core.atlas.find("commandblocks-b-grenade-back");

this.global.bullets.grenade = grenade;

const flashSpark = this.global.fx.flashSpark;
var t = this;
const flashbang = extend(BasicBulletType,{
  draw(b){
    var h = -1*b.fin()*(b.fin()-1)*190;
    Draw.color(this.backColor);
    Draw.rect(this.backRegion, b.x, b.y+h, Time.time()*2);
    Draw.color(this.frontColor);
    Draw.rect(this.frontRegion, b.x, b.y+h, Time.time()*2);
    Draw.color();
  },
  hit(b, x, y){
    if(x === undefined || x === null){
      x = b.x; y = b.y;
    }
    var v1 = Core.camera.unproject(0, 0);
    v1 = Vec2(v1.x, v1.y); //Dont even ask.
    var v2 = Core.camera.unproject(Core.graphics.getWidth(), Core.graphics.getHeight());
    //print(v1); print(v2); print("Pos: ("+x+", "+y+")");
    if(v1.x<x && x<v2.x && v1.y<y && y<v2.y) this.flash((b.getTeam()==Vars.player.getTeam())?4:11);

    this.super$hit(b, x, y);
  },
  flash(duration){
    var image = new Image();
    var flashBeep = t.global.newSounds.beep;
    const sid = flashBeep.play(Core.settings.getInt("sfxvol") / 100);
    const vol = Core.settings.getInt("sfxvol") -1;
    vol++;
    if(sid != -1) flashBeep.setLooping(sid, true);
    //print(sid); print(Core.settings.getInt("sfxvol") / 100);
    image.getColor().a = 1;
    image.touchable(Touchable.disabled);
    image.setFillParent(true);
    image.actions(Actions.delay(duration), Actions.fadeOut(15), Actions.remove());
    if(sid != -1){
      Time.run(duration*60+15*60,run(()=>{
        flashBeep.stop(sid);
        //Core.settings.put("sfxvol", vol);
      }));
    }
    image.update(run(() => {
      //image.toFront();
      if(sid != -1) flashBeep.setVolume(sid, (vol / 100)*image.getColor().a);
      //Core.settings.put("sfxvol", (1-image.getColor().a)*vol/100);
      //print((Core.settings.getInt("sfxvol") / 100)*image.getColor().a);
      if(Vars.state.is(GameState.State.menu)||Vars.player.isDead()){
        image.remove();
        if(sid != -1) flashBeep.stop(sid);
        //Core.settings.put("sfxvol", vol);
      }
    }));
    Core.scene.add(image);
  },
  //despawned(b){},
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.2)) Effects.effect(flashSpark, b.x, b.y - b.fin()*(b.fin()-1)*190);
  }
});
flashbang.speed = 3.2;
flashbang.lifetime = 70;
flashbang.collidesTiles = false;
flashbang.collides = false;
flashbang.collidesAir = false;
flashbang.keepVelocity = false;
flashbang.hitSound = Sounds.explosion;
flashbang.splashDamage = 30;
flashbang.splashDamageRadius = 60;
flashbang.hitEffect = this.global.fx.flashbang;
flashbang.despawnEffect = Fx.none;
flashbang.bulletSprite = "commandblocks-b-flashbang";
flashbang.frontColor = Color.white;
flashbang.backColor = Color.lightGray;

this.global.bullets.flashbang = flashbang;

const molotov = extend(BasicBulletType,{
  draw(b){
    var h = -1*b.fin()*(b.fin()-1)*190;
    Draw.color(this.backColor);
    Draw.rect(this.backRegion, b.x, b.y+h, Time.time()*2);
    Draw.color(this.frontColor);
    Draw.rect(this.frontRegion, b.x, b.y+h, Time.time()*2);
    Draw.color();
  },
  hit(b,x,y){
    if(x === undefined || x === null){
      x = b.x; y = b.y;
    }
    Puddle.deposit(Vars.world.tileWorld(x, y), Liquids.oil, 1200);
    this.super$hit(b, x, y);
  },
  //despawned(b){},
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.1)) Effects.effect(Fx.smoke, b.x, b.y - b.fin()*(b.fin()-1)*190);
  }
});
molotov.speed = 3.2;
molotov.lifetime = 70;
molotov.collidesTiles = false;
molotov.collides = false;
molotov.collidesAir = false;
molotov.keepVelocity = false;
molotov.hitSound = Sounds.explosion;
molotov.splashDamage = 75;
molotov.splashDamageRadius = 70;
molotov.hitShake = 5;
molotov.hitEffect = Fx.explosion;
molotov.bulletSprite = "commandblocks-b-molotov";
molotov.frontColor = Pal.lightishOrange; 
molotov.backColor = Pal.lightOrange;
molotov.incendChance = 1; 
molotov.incendAmount = 25;
molotov.incendSpread = 35;

this.global.bullets.molotov = molotov;
