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
		if(b.time()<45) return;
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
    if(Core.settings.getBool("animatedshields") && Shaders.shield != null){
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

      if(b.lifetime() - b.time() < 30){
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
      Vars.bulletGroup.intersect(b.x - realRadius, b.x - realRadius, realRadius*2, realRadius * 2, cons(trait => {
        if(trait.canBeAbsorbed() && trait.getTeam() != b.getTeam() && Intersector.isInsideHexagon(trait.getX(), trait.getY(), this.radius * this.radscl[b.id] * 2, b.x, b.y)){
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
this.global.bullets.forceSmall = forceSmall;
