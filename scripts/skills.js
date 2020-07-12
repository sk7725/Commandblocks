const KeyCode=Packages.arc.input.KeyCode;
this.global.skills={};
const skills={
	"coalbomb":{
		type:"skill.atk",
		tier:1,
		cooltime:1.5,
		uses:{
			item:"coal",
			amount:4
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
		cooltime:2.5,
		uses:{
			item:"coal",
			amount:8
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
			amount:6
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
    duration:8.3,
    cooltime:24.8,
		uses:{
			item:"pyratite",
			amount:12
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
    duration:7,
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
    duration:2.2,
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
		cooltime:30,
    healthcost:10,
		uses:{
			item:"surge-alloy",
			amount:14
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
		type:"skill.atk",
		tier:2,
		cooltime:8.5,
    healthcost:18,
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
    duration:7.5,
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
  "scalshield":{
    type:"skill.def",
    tier:2,
    cooltime:20,
    duration:120,
    uses:{
      item:"commandblocks-ref-scalar",
      amount:14
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
    cooltime:13.5,
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
      amount:1
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
    cooltime:10.8,
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
  "zetarecharge":{
    type:"skill.support",
    tier:1,
    duration:8.3,
    cooltime:30,
    uses:{
      item:"commandblocks-ore-zeta",
      amount:15
    },
    cost:[
      {
        item:"phase-fabric",
        amount:81
      },
      {
        item:"commandblocks-ref-zeta",
        amount:40
      }
    ]
  },
  "zetasabo":{
    type:"skill.support",
    tier:2,
    cooltime:28,
    duration:10,
    uses:{
      item:"commandblocks-ore-zeta",
      amount:13
    },
    cost:[
      {
        item:"phase-fabric",
        amount:195
      },
      {
        item:"commandblocks-ref-zeta",
        amount:110
      },
      {
        item:"commandblocks-s-code",
        amount:56
      }
    ],
    parent:"zetarecharge"
  },
  "zetatrap":{
    type:"skill.support",
    tier:3,
    cooltime:11,
    duration:3.6,
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
      }
    ],
    parent:"zetasabo"
  },
  "spaceblink":{
    type:"skill.def",
    tier:2,
    cooltime:30.3,
    duration:15,
    uses:{
      item:"commandblocks-t-space",
      amount:15
    },
    cost:[
      {
        item:"phase-fabric",
        amount:340,
      },
      {
        item:"commandblocks-ref-vector",
        amount:231,
      },
      {
        item:"commandblocks-ref-zeta",
        amount:120,
      },
      {
        item:"commandblocks-t-space",
        amount:64,
      }
    ],
    parent:"phasetp"
  },
  "spaceportal":{
    type:"skill.move",
    tier:3,
    cooltime:0.1,
    uses:{
      item:"commandblocks-t-space",
      amount:1
    },
    cost:[
      {
        item:"titanium",
        amount:309,
      },
      {
        item:"phase-fabric",
        amount:309,
      },
      {
        item:"commandblocks-t-space",
        amount:218,
      },
      {
        item:"commandblocks-bittrium",
        amount:9,
      }
    ],
    parent:"spaceblink"
  },
  "timeworld":{
    type:"skill.secret",
    tier:4,
    cooltime:60,
    uses:{
      item:"commandblocks-t-time",
      amount:40
    },
    cost:[
      {
        item:"commandblocks-ref-scalar",
        amount:628,
      },
      {
        item:"commandblocks-t-space",
        amount:309,
      },
      {
        item:"commandblocks-t-time",
        amount:309,
      },
      {
        item:"commandblocks-bittrium",
        amount:18,
      }
    ],
    parent:"spaceportal"
  },
  "opticpresicion":{
		type:"skill.atk",
		tier:1,
		cooltime:200,
		uses:{
			item:"infinitodustry-visionary-glass",
			amount:5
		},
		cost:[
			{
				item:"infinitodustry-visionary-glass",
				amount:115
			},
			{
				item:"metaglass",
				amount:100
			},
			{
				item:"silicon",
				amount:95
			}
		]
	},
	"opticray":{
		type:"skill.atk",
		tier:2,
		cooltime:25,
uses:{
			item:"infinitodustry-visionary-glass",
			amount:0
		},
		cost:[
			{
				item:"infinitodustry-visionary-glass",
				amount:200
			},
			{
				item:"infinitodustry-toughitinum",
				amount:150
			}
		],
	parent:"opticpresicion"
	},
	"matrixtravel":{
		type:"skill.move",
		tier:2,
		cooltime:10,
		uses:{
			item:"infinitodustry-matrix",
			amount:10
		},
		cost:[
			{
				item:"infinitodustry-matrix",
				amount:95
			},
			{
				item:"phase-fabric",
				amount:115
			},
			{
				item:"infinitodustry-vector",
				amount:100
			}
		],
    parent:"phasetp"
	},
	"matrixglitch":{
		type:"skill.atk",
		tier:3,
		cooltime:45,
		uses:{
			item:"infinitodustry-matrix",
			amount:30
		},
		cost:[
			{
				item:"infinitodustry-matrix",
				amount:200
			},
			{
				item:"phase-fabric",
				amount:250
			},
			{
				item:"infinitodustry-blast-fabric",
				amount:150
			}
		],
    parent:"matrixtravel"
	},
	"matrixempower":{
		type:"skill.secret",
		tier:4,
		cooltime:100,
		healthcost:50,
		uses:{
			item:"infinitodustry-matrix",
			amount:50
		},
		cost:[
			{
				item:"infinitodustry-matrix",
				amount:450
			},
			{
				item:"surge-alloy",
				amount:305
			},
			{
				item:"infinitodustry-tensor",
				amount:250
			}
		],
    parent:"matrixglitch"
	},
	"toughitinumswarm":{
		type:"skill.support",
		tier:4,
		cooltime:1,
		uses:{
			item:"infinitodustry-toughitinum",
			amount:5
		},
		cost:[
			{
				item:"infinitodustry-toughitinum",
				amount:200
			},
			{
				item:"silicon",
				amount:250
			}
		],
    parent:"coalcrawler"
	},
	"toughitinumshield":{
		type:"skill.def",
		tier:2,
		cooltime:45,
		uses:{
			item:"infinitodustry-toughitinum",
			amount:25
		},
		cost:[
			{
				item:"infinitodustry-toughitinum",
				amount:115
			},
			{
				item:"surge-alloy",
				amount:85
			}
		],
    parent:"surgeshield"
	},
	"blastfabriccoat":{
		type:"skill.def",
		tier:3,
		cooltime:50,
		uses:{
			item:"infinitodustry-blast-fabric",
			amount:25
		},
		cost:[
			{
				item:"infinitodustry-blast-fabric",
				amount:125
			},
			{
				item:"graphite",
				amount:140
			},
			{
				item:"infinitodustry-tau-plate",
				amount:120
			},
		],
    parent:"toughitinumshield"
	},
	"tensorsensor":{
		type:"skill.support",
		tier:4,
		cooltime:65,
		uses:{
			item:"infinitodustry-tensor",
			amount:30
		},
		cost:[
			{
				item:"infinitodustry-tensor",
				amount:225
			},
			{
				item:"infinitodustry-scalar",
				amount:250
			},
			{
				item:"surge-alloy",
				amount:215
			},
		],
    parent:"matrixglitch"
	},
	"tensorsensor":{
		type:"skill.secret",
		tier:3,
		cooltime:40,
		uses:{
			item:"infinitodustry-tensor",
			amount:60
		},
		cost:[
			{
				item:"infinitodustry-tensor",
				amount:230
			},
			{
				item:"infinitodustry-infiar",
				amount:100
			},
			{
				item:"silicon",
				amount:250
			},
		],
    parent:"matrixtravel"
	},
  "uranblast":{
		type:"skill.atk",
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
	},
	"uranwave":{
		type:"skill.atk",
		tier:3,
		cooltime:50,
		healthcost:50,
		uses:{
			item:"steam-power-uranium",
			amount:40
		},
		cost:[
			{
				item:"steam-power-iron",
				amount:260
			},
			{
				item:"plastanium",
				amount:60
			},
			{
				item:"steam-power-uranium",
				amount:500
			}
		],
    parent:"uranblast"
	},
  "zincray":{
    type:"skill.atk",
    tier: 1,
    cooltime:1.5,
    uses:{
      item:"mindblow-zinc",
      amount:3
    },
    cost:[
      {
        item:"mindblow-zinc",
        amount:230
      },
      {
        item:"surge-alloy",
        amount:85
      }
    ],
    parent:"coalbomb"
  },
  "zincstorm":{
    type:"skill.atk",
    tier: 2,
    cooltime:4,
    uses:{
      item:"mindblow-zinc",
      amount:8
    },
    cost:[
      {
        item:"mindblow-zinc",
        amount:650
      },
      {
        item:"surge-alloy",
        amount:125
      }
    ],
    parent:"zincray"
  },
  "zincexplosion":{
    type:"skill.support",
    tier: 3,
    cooltime:150,
    healthcost:90,
    uses:{
      item:"mindblow-zinc",
      amount:60
    },
    cost:[
      {
        item:"mindblow-zinc",
        amount:1568
      },
      {
        item:"surge-alloy",
        amount:459
      }
    ],
    parent:"zincstorm"
  },
	"youShallNotPass":{
		type:"skill.support",
		tier:1,
		cooltime:5,
		uses:{
			item:"copper",
			amount:1
		},
		cost:[
			{
				item:"copper",
				amount:1
			}
		]
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
const spellstart = newEffect(23, e => {
  Draw.color(e.color);
  Lines.stroke(e.fout() * 5);
  Lines.circle(e.x, e.y, 3 + e.fin() * 80);
});
const uranwaveexpand = newEffect(30, e => {
  Draw.color(Color.valueOf("fffbf7"));
  var radiusofcircle = e.fin() * 70;
  if(radiusofcircle > 50){
	  radiusofcircle += -1*(e.fin() * 20 + 50)
  }
  Fill.circle(e.x, e.y, radiusofcircle);
});
const customfx = this.global.fx;
const slasheffect = customfx.slash;
const swordeffect = customfx.sword;

const boostedskill= extendContent(StatusEffect,"boostedskill",{});
boostedskill.speedMultiplier=1.45;
boostedskill.color=Pal.redderDust;
boostedskill.effect=boostfire;
const jamweapons = extendContent(StatusEffect,"jamweapons",{
  update(unit, time){
    this.super$update(unit, time);
    unit.getTimer().get(unit.getShootTimer(true),1);
    unit.getTimer().get(unit.getShootTimer(false),1);
  }
});
jamweapons.color=Color.orange;
jamweapons.effect=Fx.purifystone;
const bleach = extendContent(StatusEffect,"bleach",{
  update(unit, time){
    this.super$update(unit, time);
    if(unit==Vars.player){
      if(time<2) Draw.blend();
      else Draw.blend(Blending.additive);
    }
  }
});
bleach.color=Color.white;
const ram = extendContent(StatusEffect,"ram",{
  update(unit, time){
    this.super$update(unit, time);
    var v1=Vec2(2,0).setAngle(unit.rotation);
    unit.move(v1.x, v1.y);
  }
});
ram.color=Pal.meltdownHit;
ram.effect=Fx.hitMeltdown;

const shieldbreak = extendContent(StatusEffect,"shieldbreak",{});
const shieldsmall = extendContent(StatusEffect,"shieldsmall",{
  _unithp:[],
  _shieldhp:[],
  update(unit, time){
    this.super$update(unit, time);
    try{
      if(this._unithp[unit.id] == null){
        this._unithp[unit.id] = unit.health();
        if(this._shieldhp[unit.id] == null) this._shieldhp[unit.id] = 300;
      }
      if(time<2){
        //do not expect this to always work, deltatime
        delete this._unithp[unit.id];
        delete this._shieldhp[unit.id];
        unit.applyEffect(shieldbreak, 1);//just in case
        Effects.effect(customfx.unitShieldEnd, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        return;
      }
      if(this._shieldhp[unit.id] <= 0) return;
      if(unit.health() > this._unithp[unit.id]) this._unithp[unit.id] = unit.health();
      else if(unit.health() < this._unithp[unit.id]){
        var dmg = this._unithp[unit.id] - unit.health();
        this._shieldhp[unit.id] -= dmg;
        unit.health(this._unithp[unit.id]+0.01);
        if(this._shieldhp[unit.id]>0) Effects.effect(customfx.unitShieldHit, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        else{
          delete this._unithp[unit.id];
          delete this._shieldhp[unit.id];
          unit.applyEffect(shieldbreak, 1);//just in case
          Effects.effect(customfx.unitShieldBreak, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        }
      }
    }
    catch(err){
      print(err);
    }
  },
  getTransition(unit, to, time, newTime, result){
    if(to == shieldbreak){
      return result.set(to, 1);
    }
    else return this.super$getTransition(unit, to, time, newTime, result);
  }
});
shieldsmall.color = Color.valueOf("ffd37f");
shieldsmall.opposite(shieldbreak);
const shieldlarge = extendContent(StatusEffect,"shieldlarge",{
  _unithp:[],
  _shieldhp:[],
  update(unit, time){
    this.super$update(unit, time);
    try{
      if(this._unithp[unit.id] == null){
        this._unithp[unit.id] = unit.health();
        if(this._shieldhp[unit.id] == null) this._shieldhp[unit.id] = 1000;
      }
      if(time<2){
        //do not expect this to always work, deltatime
        delete this._unithp[unit.id];
        delete this._shieldhp[unit.id];
        unit.applyEffect(shieldbreak, 1);//just in case
        Effects.effect(customfx.unitShieldEnd, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        return;
      }
      if(this._shieldhp[unit.id] <= 0) return;
      if(unit.health() > this._unithp[unit.id]) this._unithp[unit.id] = unit.health();
      else if(unit.health() < this._unithp[unit.id]){
        var dmg = this._unithp[unit.id] - unit.health();
        this._shieldhp[unit.id] -= dmg;
        unit.health(this._unithp[unit.id]+0.01);
        if(this._shieldhp[unit.id]>0) Effects.effect(customfx.unitShieldHit, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        else{
          delete this._unithp[unit.id];
          delete this._shieldhp[unit.id];
          unit.applyEffect(shieldbreak, 1);//just in case
          Effects.effect(customfx.unitShieldBreak, unit.getX(), unit.getY(), 0, (unit instanceof BaseUnit)?unit.getType().hitsize:((unit instanceof Player)?unit.mech.hitsize*1.5:8));
        }
      }
    }
    catch(err){
      print(err);
    }
  },
  getTransition(unit, to, time, newTime, result){
    if(to == shieldbreak){
      return result.set(to, 1);
    }
    else return this.super$getTransition(unit, to, time, newTime, result);
  }
});
shieldlarge.color = Color.valueOf("ffd37f");
shieldlarge.opposite(shieldbreak);
shieldbreak.opposite(shieldsmall);//just in case 2
shieldbreak.opposite(shieldlarge);
this.global.shieldcomp = {};
this.global.shieldcomp.small = shieldsmall;
this.global.shieldcomp.large = shieldlarge;

const zetacolor=Color.valueOf("82ffe8");
const saboskill=extendContent(StatusEffect,"sabotagedskill",{});
saboskill.speedMultiplier=-1.0;
saboskill.color=zetacolor;
//saboskill.effect=sabofire;

const pushing=extendContent(StatusEffect,"pushing",{
	update(unit,time){
		var x=unit.getX();
		var y=unit.getY();
		var radius=15*Vars.tilesize;
		Units.nearbyEnemies(unit.getTeam(),x-radius,y-radius,2*radius,2*radius,cons(e=>{
			if(unit.withinDst(x,y,radius)){
				var vec=new Vec2(e.x-x,e.y-y);
				e.velocity().add(vec.scl((radius-vec.len())/16384));
			}
		}))
		this.super$update(unit,time);
	}
});

//Partial Credit to younggam

const customb = this.global.bullets;
const gravityTrap = customb.gravityTrap;
const arcCasterBullet = customb.arcCasterBullet;
const forceSmall = customb.forceSmall;
const effectZone = customb.effectZone;

const vanillaskills=30;
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
      if(Skill.skill!=""&&Skill.lastused+obj.cooltime*60<=Time.time()&&(Vars.player.item().item.name==obj.uses.item||Vars.player.item().item.name=="skillplus-mana")&&Vars.player.item().amount>=obj.uses.amount){
        try{
          //this[Skill.skill](Vars.player);
          tile.configure(-1*(1+obj.n));
          //Vars.player.addItem(Vars.player.item().item,Math.floor(-1*obj.uses.amount));
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
    //if(Vars.net.client()) return;
    //Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
    Bullet.create(bullet, player, player.getTeam(), player.getX(), player.getY(), player.rotation, v,life);
  },
	fireOffset(bullet,player,v,life,offset){
    //if(Vars.net.client()) return;
    //Call.createBullet(bullet, player.getTeam(), player.getX(), player.getY(), player.rotation+offset, v,life);
    Bullet.create(bullet, player, player.getTeam(), player.getX(), player.getY(), player.rotation + offset, v,life);
  },
  coalbomb(player){
    this.fire(customb.grenade, player, 0.5, 1);
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
    Call.createBullet(bullets[choice], player.getTeam(), player.getX(), player.getY(), player.rotation, 1, 1);
  },
  phaseskill(player,tile){
    if(Vars.net.client()) return;
    var arr=Object.keys(skills);
    var n=Math.floor(vanillaskills*Math.random());
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
  pyraheal(player){
    Sounds.unlock.at(player.getX(),player.getY(),0.75);
    this.fire(customb.healZone, player, 1, 1);
  },
  pyraboost(player){
    var x=player.getX(); var y=player.getY();
    Sounds.flame.at(x, y, 0.27);
    Effects.effect(spellstart,Color.valueOf("ffaa5f"), x, y);
    Units.nearby(player.getTeam(), x, y, 10*Vars.tilesize, cons(e=>{
      e.applyEffect(StatusEffects.overdrive, 420);
    }));
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
    Damage.collideLine(b,player.getTeam(),slasheffect,x,y,dir,21*Vars.tilesize);
    Damage.collideLine(b,player.getTeam(),Fx.none,x,y,dir,21*Vars.tilesize,true);
    player.applyEffect(boostedskill,1);
    var posnew=Vec2(21*Vars.tilesize,0).setAngle(dir);
    player.move(posnew.x,posnew.y);
    if(player==Vars.player)  Core.camera.position.set(player);
    x=player.getX(); y=player.getY();
    Sounds.spark.at(x,y,1.6);
    Effects.effect(Fx.lancerLaserShootSmoke, x, y,(dir+180)%360);
    player.velocity().set(Vec2(4,0).setAngle(dir));
  },
  surgeshield(player){
    player.damage(player.maxHealth()*0.10);
    Sounds.laser.at(player.getX(),player.getY(),0.6);
    this.fire(forceSmall, player, 1, 1);
  },
  surgecloud(player){
    player.damage(player.maxHealth()*0.18);
    Sounds.spark.at(player.getX(),player.getY(),0.2);
    this.fire(arcCasterBullet, player, 0.65, 5);
  },
  scalshield(player){
    var x=player.getX(); var y=player.getY();
    Sounds.message.at(x, y, 1.6);
    Effects.effect(spellstart,Color.valueOf("f5bbf1"), x, y);
    Units.nearby(player.getTeam(), x, y, 10*Vars.tilesize, cons(e=>{
      if(shieldsmall._unithp[e.id]!=null) delete shieldsmall._unithp[e.id];
      if(shieldsmall._shieldhp[e.id]!=null) delete shieldsmall._shieldhp[e.id];
      e.applyEffect(shieldsmall, 7200);
    }));
  },
  vecslash(player){
    var x=player.getX(); var y=player.getY();
    Sounds.message.at(x, y, 4.7);
    Effects.effect(swordeffect, x, y, player.rotation);
    var v1=Vec2(6,0).setAngle(player.rotation);
    Damage.damage(player.getTeam(), x+v1.x, y+v1.y, 24, 120);
    Vars.bulletGroup.intersect(x+v1.x-6, y+v1.y-6, x+v1.x+6, y+v1.y+6).each(cons(b=>{
      //deflect
      if(b.getTeam()!=player.getTeam()){
        b.velocity().x*=-1;
        b.velocity().y*=-1;
        b.resetOwner(player, player.getTeam());
        b.scaleTime(1);
        b.deflect();
        Effects.effect(Fx.lightningShoot, b.x, b.y, b.velocity().angle());
      }
    }));
  },
  zetarecharge(player){
    Sounds.spark.at(player.getX(),player.getY(),0.45);
    Bullet.create(effectZone, player, player.getTeam(), player.getX(), player.getY(), player.rotation, 1, 1, Vars.content.getByName(ContentType.status, "commandblocks-skillup"));
  },
  zetatrap(player){
    /*
		var mx=Core.input.mouseWorld().x;
		var my=Core.input.mouseWorld().y;
    var vec=Core.input.mouseWorld(Vars.control.input.getMouseX(),Vars.control.input.getMouseY());
    if(player==Vars.player){
			var distvec=Vec2(vec.x-player.getX(),vec.x-player.getX());
			Call.createBullet(gravityTrap,player.getTeam(),vec.x,vec.y,distvec.angle(),distvec.len(),1);
		}*/
    this.fire(gravityTrap, player, 1, 1);
  },
  spaceblink(player){
    Sounds.spark.at(player.getX(),player.getY(),0.4);
    Sounds.spray.at(player.getX(),player.getY(),0.4);
    if(Vars.net.client()) return;
    var tx = player.getX()+Math.random()*Vars.tilesize*32-Vars.tilesize*16;
    var ty = player.getY()+Math.random()*Vars.tilesize*32-Vars.tilesize*16;
    Call.createBullet(customb.distZone, player.getTeam(), tx, ty, 0, 1, 1);
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
  uranwave(player){
    var x=player.getX(); var y=player.getY();
    player.damage(player.maxHealth()*0.5);
    Effects.effect(uranwaveexpand, x, y);
    Damage.createIncend(x, y, 50, 6);
    Sounds.explosionBig.at(x,y);
    if(Vars.net.client()) return;
    Damage.damage(player.getTeam(),x,y,50,500);
  },
  zincray(player){
    Sounds.spark.at(player.getX(),player.getY(),1.4);
    this.fire(Bullets.arc, player, 1, 1);
  },
  zincstorm(player){
    Sounds.laser.at(player.getX(),player.getY(),1.1);
    this.fire(Bullets.arc, player, 1, 1);
    this.fire(Bullets.lancerLaser, player, 1, 1);
  },
  zincexplosion(player){
    Effects.effect(Fx.explosion,player.getX(), player.getY());
    Sounds.laser.at(player.getX(),player.getY(),0.8);
    player.damage(player.maxHealth()*0.9);
    if(player.tileOn().solid()){
      for(var i=1;i<=15;i++){
        this.fire(Bullets.bombExplosive, player, 0.01, 0.01);
      }
      return;
    }
    if(Vars.net.client()) return;
    var chaosarrayunit=UnitTypes.chaosArray.create(player.getTeam());
    chaosarrayunit.set(player.getX(),player.getY());
    chaosarrayunit.add();
  },
	youShallNotPass(player){
		player.applyEffect(pushing,300);
	}
}
this.global.skills.func=skillfunc;
