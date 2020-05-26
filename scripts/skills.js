const KeyCode=Packages.arc.input.KeyCode;
this.global.skills={};
const skills={
	"coalbomb":{
		type:"skill.atk",
		tier:1,
		cooltime:1.5,
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
		cooltime:2.5,
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
		type:"skill.atk",
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
		cooltime:0.5,
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
        if(Time.time()-this._lasttouch<doubletaptick&&Time.time()>this._lasttouch&&this._lasttouch>0&&inc<10){
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
  update(Skill){
    if(Skill.skill=="") return false;

    if(this.getInput()){
      var obj=skills[Skill.skill];
      if(Skill.skill!=""&&Skill.lastused+obj.cooltime<=Time.time()&&Vars.player.item().item.name==obj.uses.item&&Vars.player.item().amount>=obj.uses.amount){
        try{
          var ret=this[Skill.skill]();
          Vars.player.addItem(Vars.player.item().item,Math.floor(-1*ret*obj.uses.amount));
          return true;
        }
        catch(err){
          return false;
        }
      }
      else{
        Effects.effect(Fx.smelt,Color.valueOf("aaaaaa"),Vars.player.getX(), Vars.player.getY());
        return false;
      }
    }

    if(Skill.skill!=""&&Skill.lastused+skills[Skill.skill].cooltime==Time.time()) Effects.effect(Fx.absorb,Vars.player.getX(), Vars.player.getY());
    return false;
  },
  coalbomb(){
    Bullet.create(Bullets.bombExplosive, Vars.player, Vars.player.getTeam(), Vars.player.getX(), Vars.player.getY(), Vars.player.rotation, 3,3);
    return 1;
  },
  coalfire(){
    Bullet.create(Bullets.bombIncendiary, Vars.player, Vars.player.getTeam(), Vars.player.getX(), Vars.player.getY(), Vars.player.rotation, 4,5);
    return 1;
  }
}
this.global.skills.func=skillfunc;
