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
		cooltime:10,
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
const doubletaptick=15;
const skillfunc={
  _lasttouch:0,
  _lastx:0,
  _lasty:0,
  getInput(){
    if(Vars.mobile){
      if(Core.input.justTouched()){
        var inc=Math.max(Math.abs(Core.input.mouseX()-this._lastx),Math.abs(Core.input.mouseY()-this._lasty));
        if(Time.time()-this._lasttouch<doubletaptick&&Time.time()>this._lasttouch&&this._lasttouch>0&&inc<30){
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

    if(Skill.skill!=""&&Skill.lastused+Math.floor(skills[Skill.skill].cooltime*60)==Time.time()) Effects.effect(Fx.absorb,Vars.player.getX(), Vars.player.getY());
    return false;
  },
  fire(bullet,player,v,life){
    if(Vars.net.client()) return;
    Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
    //Bullet.create(bullet,null, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
  },
  coalbomb(player){
    this.fire(Bullets.bombExplosive, player, 10, 3);
  },
  coalfire(player){
    this.fire(Bullets.bombOil, player, 8, 3);
    this.fire(Bullets.bombIncendiary, player, 8, 3);
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
    var n=Math.floor((arr.length/3*4)*Math.random())
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
    this.fire(Bullets.meltdownLaser, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
    this.fire(Bullets.lightning, player, 1, 1);
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
  }
}
this.global.skills.func=skillfunc;
