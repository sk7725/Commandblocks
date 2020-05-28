const KeyCode=Packages.arc.input.KeyCode;
this.global.skills={};
const skills={
	"coalbomb":{
		type:"skill.atk",
		tier:1,
		cooltime:0.5,
		uses:{
			item:"coal",
			amount:3
		},
		cost:[
			{
				item:"lead",
				amount:30
			},
			{
				item:"metaglass",
				amount:90
			}
		]
	},
	"coalfire":{
		type:"skill.atk",
		tier:2,
		cooltime:1.5,
		uses:{
			item:"coal",
			amount:3
		},
		cost:[
      {
				item:"metaglass",
				amount:200
			},
			{
				item:"titanium",
				amount:60
			}
		],
		parent:"coalbomb"
	},
  "coalcrawler":{
		type:"skill.support",
		tier:3,
		cooltime:5,
		uses:{
			item:"coal",
			amount:13
		},
		cost:[
			{
				item:"lead",
				amount:200
			},
      {
				item:"metaglass",
				amount:450
			},
			{
				item:"silicon",
				amount:350
			}
		],
		parent:"coalfire"
	},
  "metabomb":{
    type:"skill.support",
    tier:3,
    cooltime:11,
    uses:{
      item:"metaglass",
      amount:9
    },
    cost:[
      {
        item:"metaglass",
        amount:660
      },
      {
        item:"silicon",
        amount:85
      }
    ],
    parent:"coalfire"
  },
  "titanshot":{
    type:"skill.atk",
    tier:2,
    cooltime:11,
    uses:{
      item:"titanium",
      amount:6
    },
    cost:[
      {
        item:"metaglass",
        amount:120
      },
      {
        item:"titanium",
        amount:270
      }
    ],
    parent:"thorshot"
  },
  "thorshot":{
		type:"skill.atk",
		tier:1,
		cooltime:2,
		uses:{
			item:"thorium",
			amount:4
		},
		cost:[
			{
				item:"titanium",
				amount:50
			},
			{
				item:"thorium",
				amount:50
			}
		]
	},
	"thorhoming":{
		type:"skill.atk",
		tier:2,
		cooltime:4,
    healthcost:5,
		uses:{
			item:"thorium",
			amount:10
		},
		cost:[
      {
				item:"silicon",
				amount:250
			},
			{
				item:"thorium",
				amount:130
			}
		],
		parent:"thorshot"
	},
  "thorbeam":{
		type:"skill.atk",
		tier:3,
		cooltime:15,
    healthcost:80,
		uses:{
			item:"thorium",
			amount:40
		},
		cost:[
			{
				item:"silicon",
				amount:330
			},
      {
				item:"thorium",
				amount:670
			},
			{
				item:"surge-alloy",
				amount:230
			}
		],
		parent:"thorhoming"
	},
	"phasetp":{
		type:"skill.move",
		tier:1,
		cooltime:1,
		uses:{
			item:"phase-fabric",
			amount:1
		},
		cost:[
			{
				item:"metaglass",
				amount:45
			},
			{
				item:"silicon",
				amount:100
			},
			{
				item:"phase-fabric",
				amount:50
			}
		]
	},
  "phaseshot":{
		type:"skill.atk",
		tier:2,
		cooltime:0.1,
		uses:{
			item:"phase-fabric",
			amount:3
		},
		cost:[
			{
				item:"titanium",
				amount:300
			},
			{
				item:"phase-fabric",
				amount:175
			},
			{
				item:"surge-alloy",
				amount:25
			}
		],
    parent:"phasetp"
	},
  "phaseskill":{
		type:"skill.support",
		tier:3,
		cooltime:8.5,
		uses:{
			item:"phase-fabric",
			amount:10
		},
		cost:[
			{
				item:"thorium",
				amount:455
			},
			{
				item:"phase-fabric",
				amount:256
			},
			{
				item:"surge-alloy",
				amount:50
			}
		],
    parent:"phaseshot"
	},
  "pyraheal":{
		type:"skill.support",
		tier:1,
		cooltime:7,
		uses:{
			item:"pyratite",
			amount:7
		},
		cost:[
			{
				item:"lead",
				amount:145
			},
			{
				item:"metaglass",
				amount:70
			}
		]
	},
  "pyraboost":{
		type:"skill.support",
		tier:2,
		cooltime:14,
		uses:{
			item:"pyratite",
			amount:10
		},
		cost:[
			{
				item:"lead",
				amount:280
			},
			{
				item:"metaglass",
				amount:70
			},
			{
				item:"titanium",
				amount:60
			}
		],
    parent:"pyraheal"
	},
  "blastdash":{
		type:"skill.move",
		tier:1,
		cooltime:2.3,
		uses:{
			item:"blast-compound",
			amount:4
		},
		cost:[
			{
				item:"metaglass",
				amount:60
			},
			{
				item:"silicon",
				amount:60
			}
		]
	},
  "blastback":{
		type:"skill.move",
		tier:2,
		cooltime:3,
		uses:{
			item:"blast-compound",
			amount:6
		},
		cost:[
			{
				item:"titanium",
				amount:250
			},
			{
				item:"phase-fabric",
				amount:120
			}
		],
    parent:"blastdash"
	},
  "blastcut":{
		type:"skill.atk",
		tier:3,
		cooltime:0.3,
		uses:{
			item:"blast-compound",
			amount:6
		},
		cost:[
			{
				item:"titanium",
				amount:600
			},
			{
				item:"phase-fabric",
				amount:290
			},
			{
				item:"surge-alloy",
				amount:35
			}
		],
    parent:"blastback"
	},
  "surgeshield":{
		type:"skill.def",
		tier:1,
		cooltime:12.5,
    healthcost:6,
		uses:{
			item:"surge-alloy",
			amount:8
		},
		cost:[
			{
				item:"phase-fabric",
				amount:90
			},
			{
				item:"surge-alloy",
				amount:45
			}
		]
	},
	"surgecloud":{
		type:"skill.def",
		tier:2,
		cooltime:8.5,
    healthcost:9,
		uses:{
			item:"surge-alloy",
			amount:12
		},
		cost:[
			{
				item:"titanium",
				amount:350
			},
			{
				item:"phase-fabric",
				amount:100
			},
			{
				item:"surge-alloy",
				amount:75
			}
		],
    parent:"surgeshield"
	},
  "surgeemp":{
		type:"skill.support",
		tier:3,
		cooltime:15,
		uses:{
			item:"surge-alloy",
			amount:10
		},
		cost:[
			{
				item:"silicon",
				amount:560
			},
			{
				item:"surge-alloy",
				amount:200
			}
		],
    parent:"surgecloud"
	},
  "scalreset":{
    type:"skill.support",
    tier:1,
    cooltime:7.5,
    uses:{
      item:"commandblocks-ore-scalar",
      amount:6
    },
    cost:[
      {
        item:"plastanium",
        amount:50
      },
      {
        item:"commandblocks-ref-scalar",
        amount:70
      }
    ]
  },
  "scalheadbutt":{
    type:"skill.atk",
    tier:2,
    cooltime:4.5,
    uses:{
      item:"commandblocks-ref-scalar",
      amount:6
    },
    cost:[
      {
        item:"plastanium",
        amount:120
      },
      {
        item:"commandblocks-ref-scalar",
        amount:95
      },
      {
        item:"commandblocks-ref-vector",
        amount:85
      }
    ],
    parent:"scalreset"
  },
  "vecradian":{
    type:"skill.atk",
    tier:1,
    cooltime:11,
    uses:{
      item:"commandblocks-ore-vector",
      amount:12
    },
    cost:[
      {
        item:"plastanium",
        amount:75
      },
      {
        item:"commandblocks-ref-scalar",
        amount:20
      },
      {
        item:"commandblocks-ref-vector",
        amount:40
      }
    ]
  },
  "vecslash":{
    type:"skill.def",
    tier:2,
    cooltime:0.1,
    uses:{
      item:"commandblocks-ref-vector",
      amount:2
    },
    cost:[
      {
        item:"plastanium",
        amount:140
      },
      {
        item:"phase-fabric",
        amount:135
      },
      {
        item:"commandblocks-ref-vector",
        amount:115
      }
    ],
    parent:"vecradian"
  },
  "vecshot":{
    type:"skill.atk",
    tier:3,
    cooltime:7,
    uses:{
      item:"commandblocks-ref-vector",
      amount:8
    },
    cost:[
      {
        item:"phase-fabric",
        amount:350
      },
      {
        item:"commandblocks-ref-vector",
        amount:256
      }
    ],
    parent:"vecslash"
  },
	"zetatrap":{
		type:"skill.support",
		tier:3,
		cooltime:7.6,
		uses:{
			item:"commandblocks-ref-zeta",
			amount:7
		},
		cost:[
			{
				item:"phase-fabric",
				amount:300,
			},
			{
				item:"commandblocks-ref-zeta",
				amount:456,
			},
		]
	},
  "uranblast":{
		type:"skill.attack",
		tier:2,
		cooltime:14,
		healthcost:100,
		uses:{
			item:"steam-power-uranium",
			amount:30
		},
		cost:[
			{
				item:"steam-power-iron",
				amount:105
			},
			{
				item:"thorium",
				amount:100
			},
			{
				item:"steam-power-uranium",
				amount:160
			}
		],
    parent:"coalfire"
	}
};
this.global.skills.skills=skills;

const boostfire = newEffect(50, e => {
  var len = e.finpow() * 10;
  var ang = e.rotation + 180 + Mathf.randomSeedRange(e.id, 30);
  Draw.color(Pal.redderDust, Pal.lightOrange, e.fin());
  Fill.circle(e.x + Angles.trnsx(ang, len), e.y + Angles.trnsy(ang, len), 2 * e.fout());
});
const booststart = newEffect(23, e => {
  Draw.color(Pal.redderDust);
  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, 3 + e.fin() * 14);
});
const slasheffect = newEffect(90, e => {
  Draw.color(Pal.lancerLaser);
  Drawf.tri(e.x, e.y, 4 * e.fout(), 45, (e.id*57 + 90)%360);
	Drawf.tri(e.x, e.y, 4 * e.fout(), 45, (e.id*57 - 90)%360);
});

const boostedskill= extendContent(StatusEffect,"boostedskill",{});
boostedskill.speedMultiplier=1.45;
boostedskill.color=Pal.redderDust;
boostedskill.effect=boostfire;

//Partial Credit to younggam
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
const gravityTrap=extend(BasicBulletType,{
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
		/*
		var v=b.velocity().rotate(180);
		Effects.effect(gravbullet,b.x,b.y,0,v);
		b.velocity().set(0,0);
		b.x+=v.x; b.y+=v.y;
		*/
	}
});
gravityTrap.speed=0;
gravityTrap.lifetime=260;
gravityTrap.collidesTiles=false;
gravityTrap.collides=false;
gravityTrap.collidesAir=false;

//Credits to EyeofDarknedd
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

const vanillaskills=18;
const doubletaptick=15;
const skillfunc={
  _lasttouch:0,
  _lastx:0,
  _lasty:0,
  _lastcharged:0,
  getInput(){
    if(Vars.mobile){
      if(Core.input.justTouched()){
        var inc=Math.max(Math.abs(Core.input.mouseX()-this._lastx),Math.abs(Core.input.mouseY()-this._lasty));
        if(Time.time()-this._lasttouch<doubletaptick&&Time.time()>this._lasttouch+2&&this._lasttouch>0&&inc<30){
          this._lasttouch=0;
          return true;
        }
        else{
          this._lasttouch=Time.time();
          this._lastx=Core.input.mouseX();
          this._lasty=Core.input.mouseY();
          return false;
        }
      }
      else return false;
    }
    else return Core.input.keyTap(KeyCode.Q);
  },
  update(Skill,tile){
    if(Skill.skill==""||Skill==null||Skill==undefined||!skills[Skill.skill]) return false;

    if(this.getInput()){
      var obj=skills[Skill.skill];
      if(Skill.skill!=""&&Skill.lastused+obj.cooltime*60<=Time.time()&&Vars.player.item().item.name==obj.uses.item&&Vars.player.item().amount>=obj.uses.amount){
        try{
          //this[Skill.skill](Vars.player);
          tile.configure(-1*(1+obj.n));
          Vars.player.addItem(Vars.player.item().item,Math.floor(-1*obj.uses.amount));
          return true;
        }
        catch(err){
          print(err);
          return false;
        }
      }
      else{
        Effects.effect(Fx.smelt,Color.valueOf("aaaaaa"),Vars.player.getX(), Vars.player.getY());
      }
    }

    if(Skill.skill!=""&&Skill.lastused+skills[Skill.skill].cooltime*60<=Time.time()&&this._lastcharged<=Skill.lastused+skills[Skill.skill].cooltime*60){
      Effects.effect(Fx.spawn,Vars.player.getX(), Vars.player.getY());
      this._lastcharged=Time.time();
    }
    return false;
  },
  fire(bullet,player,v,life){
    if(Vars.net.client()) return;
    Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
    //Bullet.create(bullet,null, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
  },
	fireOffset(bullet,player,v,life,offset){
    if(Vars.net.client()) return;
    Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation+offset, v,life);
    //Bullet.create(bullet,null, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
  },
  coalbomb(player){
    this.fire(Bullets.bombExplosive, player, 11, 3);
  },
  coalfire(player){
    this.fire(Bullets.bombOil, player, 9, 3);
    this.fire(Bullets.bombIncendiary, player, 9, 3);
  },
  coalcrawler(player){
    if(player.tileOn().solid()){
      this.fire(Bullets.bombExplosive, player, 0.01, 0.01);
      this.fire(Bullets.bombExplosive, player, 0.01, 0.01);
      this.fire(Bullets.bombExplosive, player, 0.01, 0.01);
      return;
    }
    Effects.effect(Fx.explosion,player.getX(), player.getY());
    Sounds.explosion.at(player.getX(),player.getY(),0.8);
    if(Vars.net.client()) return;
    var crawler=UnitTypes.crawler.create(player.getTeam());
    crawler.set(player.getX(),player.getY());
    crawler.add();
  },
  phasetp(player){
    //f4ba6e windowHide
    Effects.effect(Fx.teleportOut,Color.valueOf("f4ba6e"),player.getX(), player.getY());
    var tx=((Time.time()*17%60)-30)*4;
    var ty=((Time.time()*233%60)-30)*4;
    player.set(player.getX()+tx,player.getY()+ty);
    if(player==Vars.player)  Core.camera.position.set(player);
    Sounds.windowHide.at(player.getX(),player.getY(),2+Math.random());
    Effects.effect(Fx.teleport,Color.valueOf("f4ba6e"),player.getX(), player.getY());
  },
  phaseshot(player){
    Sounds.pew.at(player.getX(),player.getY(),0.5+Math.random());
    if(Vars.net.client()) return;
    var bullets=Vars.content.bullets().toArray();
    var choice=Math.floor(Math.random()*(bullets.length));
    this.fire(bullets[choice], player, 1, 1);
  },
  phaseskill(player,tile){
    if(Vars.net.client()) return;
    var arr=Object.keys(skills);
    var n=Math.floor((vanillaskills/3*4)*Math.random());
    if(n%4==3) n-=3;
    n=n%3+Math.floor(n/4);
    if(arr[n]=="phaseskill") n-=1;
    Call.onTileConfig(player,tile,-1*(n+1));
  },
  thorshot(player){
    var bullet=player.getWeapon().bullet;
    Sounds.flame.at(player.getX(),player.getY(),1.7);
    if(Vars.net.client()) return;
    var primes=[0,2,3,5,7,11,13,17,19,23,29];//random will absoultely not work on multi
    for(var i=1;i<=10;i++){
      //Bullet.create(bullet,null, player.getTeam(), player.getX(), player.getY(), player.rotation+i*36+(Time.time()*primes[11-i])%11-6, ((Time.time()*primes[i])%60+40)/60,1.3);
      Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation+i*36+(Time.time()*primes[11-i])%11-6, ((Time.time()*primes[i])%60+40)/60,1.3);
    }
  },
  thorhoming(player){
    var bullet=Bullets.missileSwarm;
    Sounds.explosion.at(player.getX(),player.getY(),0.8);
    player.damage(player.maxHealth()*0.05);
    if(Vars.net.client()) return;
    var primes=[0,2,5,7,11,13,17,19,23,29,31,37];//random will absoultely not work on multi
    for(var i=1;i<=11;i++){
      //Bullet.create(bullet,null, player.getTeam(), player.getX(), player.getY(), player.rotation+(Time.time()*primes[12-i])%13-7, ((Time.time()*primes[i])%10+20)/25,1);
      Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation+(Time.time()*primes[12-i])%13-7, ((Time.time()*primes[i])%10+20)/25,1);
    }
  },
  thorbeam(player){
    player.damage(player.maxHealth()*0.8);
    Sounds.corexplode.at(player.getX(),player.getY(),1.5);
    this.fire(Bullets.meltdownLaser, player, 1, 1);
    this.fire(Bullets.lancerLaser, player, 1, 1);
		this.fire(Bullets.lancerLaser, player, 1, 1);
		this.fire(Bullets.lancerLaser, player, 1, 1);
		this.fire(Bullets.lancerLaser, player, 1, 1);
		this.fire(Bullets.lancerLaser, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
  },
  blastdash(player){
    Effects.effect(booststart,player.getX(), player.getY());
    Sounds.flame.at(player.getX(),player.getY(),0.4);
    player.applyEffect(boostedskill,130);
  },
	blastback(player){
		this.fire(Bullets.bombExplosive, player, 7, 1.2);
		this.fireOffset(Bullets.bombExplosive, player, 6, 1, 30);
		this.fireOffset(Bullets.bombExplosive, player, 6, 1, -30);
		Effects.effect(booststart,player.getX(), player.getY());
    Sounds.artillery.at(player.getX(),player.getY(),2.2);
    player.applyEffect(boostedskill,1);
		player.velocity().set(Vec2(10,0).setAngle((player.rotation+180)%360));
  },
	blastcut(player){
		var x=player.getX(); var y=player.getY();
		var target=Units.closestEnemy(player.getTeam(),x,y,25*Vars.tilesize,boolf(()=>true));
		var dir=player.rotation;
		if(target) dir=Vec2(target.getX()-x,target.getY()-y).angle();
		Effects.effect(Fx.lightningShoot, x, y,(dir+180)%360);
		//if(!Vars.net.client()) Call.createBullet(Bullets.lightning, player.getTeam(), player.getX(), player.getY(), dir, 1,1);
		var b=Bullet.create(Bullets.arc,null, player.getTeam(), x,y, dir,1,1);
		Damage.collideLine(b,player.getTeam(),slasheffect,x,y,dir,25*Vars.tilesize);
		Damage.collideLine(b,player.getTeam(),Fx.none,x,y,dir,25*Vars.tilesize,true);
		player.applyEffect(boostedskill,1);
		var posnew=Vec2(25*Vars.tilesize,0).setAngle(dir);
		player.move(posnew.x,posnew.y);
		if(player==Vars.player)  Core.camera.position.set(player);
		x=player.getX(); y=player.getY();
		Sounds.spark.at(x,y,1.6);
		Effects.effect(Fx.lancerLaserShootSmoke, x, y,(dir+180)%360);
		player.velocity().set(Vec2(4,0).setAngle(dir));
  },
  surgecloud(player){
    Sounds.spark.at(player.getX(),player.getY(),0.6);
    this.fire(arcCasterBullet, player, 1, 1);
  },
  uranblast(player){
    var x=player.getX(); var y=player.getY();
    player.damage(player.maxHealth()*1.5);
    Effects.effect(Fx.nuclearShockwave, x, y);
    Effects.shake(10, 10, x, y);
    Effects.effect(Fx.dynamicExplosion, x, y, 3);
    Sounds.explosionBig.at(x,y);
    if(Vars.net.client()) return;
    Damage.damage(player.getTeam(),x,y,120,690);
  },
  zetatrap(player){
    //if(player!=Vars.player) return;
		var mx=Core.input.mouseWorld().x;
		var my=Core.input.mouseWorld().y;
    var vec=Core.input.mouseWorld(Vars.control.input.getMouseX(),Vars.control.input.getMouseY());
    //Effects.effect(Fx.teleportOut,Color.valueOf("f4ba6e"),Vars.control.input.getMouseX(), Vars.control.input.getMouseY());
    if(player==Vars.player){
			var distvec=Vec2(vec.x-player.getX(),vec.x-player.getX());
			Call.createBullet(gravityTrap,player.getTeam(),vec.x,vec.y,distvec.angle(),distvec.len(),1);
		}
  }
}
this.global.skills.func=skillfunc;
