var gamerule={};
gamerule.commandBlockOutput=true;
gamerule.commandBlockTitle=false;
var effectextended={};

if(!this.global.hasOwnProperty("commandcached")) this.global.commandcached={};
const commandcached=this.global.commandcached;
const commandblocks={
  tilde(tile,inx,iny){
    if(tile instanceof Tile){
      var tmpobj={}; tmpobj.x=inx; tmpobj.y=iny;
      if(inx=="~") tmpobj.x=tile.x;
      else if(inx.substring(0,1)=="~") tmpobj.x=Number(inx.substring(1,inx.length))+tile.x;
      if(iny=="~") tmpobj.y=tile.y;
      else if(iny.substring(0,1)=="~") tmpobj.y=Number(iny.substring(1,iny.length))+tile.y;
      return tmpobj;
    }
    else{
      var tmpobj={}; tmpobj.x=inx; tmpobj.y=iny;
      var rtile=Vars.world.tileWorld(tile.x,tile.y);
      if(inx=="~") tmpobj.x=rtile.x;
      else if(inx.substring(0,1)=="~") tmpobj.x=Number(inx.substring(1,inx.length))+rtile.x;
      if(iny=="~") tmpobj.y=rtile.y;
      else if(iny.substring(0,1)=="~") tmpobj.y=Number(iny.substring(1,iny.length))+rtile.y;
      return tmpobj;
    }
  },
  targetselect(ptile,pthis,intarget){
    var obj={}; obj.a=false;
    if(typeof intarget!="string"){
      obj.r= intarget;
      return obj;
    }
    if(intarget.substring(0,2)=="@e"){
      var selectors=[];
      var stype="!tile";
      var types=[];
      var alltypes=["player","effect","groundEffect","puddle","shield","fire","unit","bullet"];//excludes "tile"
      //var steam=null; var srm=null; var sr=null; var spos={}; spos.x=null; spos.y=null; var dpos={}; dpos.x=null; dpos.y=null; var stype=null; var scount=null; var sname=null; var srot=null;
      if(intarget.substring(0,3)=="@e["&&intarget.substring(intarget.length-1,intarget.length)=="]"){
        selectors=intarget.substring(3,intarget.length-1).split(",");
      }
      if(selectors.length>0){
        stype=selectors.find(e => e.split("=")[0].trim()=="type").split("=")[1].trim();
      }
      var soppo=false;
      if(stype.substring(0,1)=="!"){
        stype=stype.substring(1,stype.length);
        soppo=true;
      }

      print("stype:"+stype+" istrue:"+alltypes.includes(stype)+" all:"+alltypes);
      if(alltypes.indexOf(stype)>-1){
        if(soppo){
          types=alltypes.slice();
          var i=types.indexOf(stype);
          types.splice(i,1);
        }
        else types.push(stype);
      }
      else if(stype=="mob"){
        if(soppo){
          types=alltypes.slice();
          var i=types.indexOf("player");
          types.splice(i,1);
          i=types.indexOf("unit");
          types.splice(i,1);
        }
        else{
          types.push("player");
          types.push("unit");
        }
      }
      else if(stype=="alleffect"){
        if(soppo){
          types=alltypes.slice();
          var i=types.indexOf("effect");
          types.splice(i,1);
          i=types.indexOf("groundEffect");
          types.splice(i,1);
        }
        else{
          types.push("effect");
          types.push("groundEffect");
        }
      }
      else if(stype=="tile"){
        if(soppo){
          types=alltypes.slice();
        }
        else{
          types.push("tile");
        }
      }
      else{
        obj.r=null;
        return obj;
      }

      if(types.length<=0){
        obj.r=null;
        return obj;
      }

      var ret=Vars[types[0]+"Group"].all();
      for(var i=1;i<types.length;i++){
        ret.addAll(Vars[types[i]+"Group"].all());
      }
      /*
      for(var i=0;i<selectors.length;i++){
        var tmparr=selectors[i].split("=");
        if(tmparr.length!=2) continue;
        var se=tmparr[1].trim();
        switch(tmparr[0].trim()){
          case "team":
            if(se==-1) steam=ptile.team;
            else steam=Team.get(se);
          break;
          case "r":
            sr=se;
          break;
        }
      }
      */
      /*
      Vars.playerGroup.all().each(cons(ent => {
          if (ent instanceof FlyingUnit) {
              print("flying " + ent);
          }
      }));*/
      //Vars.unitGroup.all().eachFilter(boolf(e => !true));
      //return Units.closest(tile.getTeam(), tile.drawx(), tile.drawy(), repairRadius,unit -> unit.health < unit.maxHealth());
      //if(ptile instanceof Tile) return ptile.block().Units.closest(steam, ptile.drawx(), ptile.drawy(), sr,true);
      if(ret.toArray().length==0) obj.r= null;
      else if(ret.toArray().length==1) obj.r= ret.toArray()[0];
      else{
        obj.r= ret;
        obj.a=true;
      }
      return obj;
    }
    else if(intarget.substring(0,2)=="@c"){
      var tag="NOTAG";
      if(intarget.substring(0,3)=="@c["&&intarget.substring(intarget.length-1,intarget.length)=="]"){
        tag=intarget.substring(3,intarget.length-1);
      }
      if(commandcached.hasOwnProperty(tag)) obj.r= commandcached[tag];
      else obj.r= null;
    }
    else if(intarget.includes(",")){
      var tmparr=intarget.split(",");
      if(tmparr.length==2){
        var ta=this.tilde(ptile,tmparr[0],tmparr[1]);
        if(!isNaN(ta.x)&&!isNaN(ta.y)){
          obj.r= Vars.world.tile(ta.x,ta.y);
        }
        else obj.r= tmparr;
      }
      else obj.r= tmparr;
    }
    else{
      switch(intarget){
        case "@s":
          obj.r= ptile;
        break;
        case "@sb":
          obj.r= ptile.block();
        break;
        case "@se":
          obj.r= ptile.ent();
        break;
        case "@t":
          obj.r= pthis;
        break;
        case "@p":
          obj.r= Vars.player;
        break;
        case "@a":
          var ret=Vars.playerGroup.all();
          if(ret.toArray().length==0) obj.r= null;
          else if(ret.toArray().length==1) obj.r= ret.toArray()[0];
          else{
            obj.r= ret;
            obj.a=true;
          }
        break;
        case "@u":
          var ret=Vars.unitGroup.all();
          if(ret.toArray().length==0) obj.r= null;
          else if(ret.toArray().length==1) obj.r= ret.toArray()[0];
          else{
            obj.r= ret;
            obj.a=true;
          }
        break;
        default:
          obj.r= intarget;
      }
    }
    return obj;
  },
  settype(ptile,pthis,intarget){
    if(intarget.includes(":")){
      var tmparr=intarget.split(":");
      if(tmparr.length==2){
        switch(tmparr[0]){
          case "array":
          case "target":
            return this.targetselect(ptile,pthis,tmparr[1]).r;
          break;
          case "tile":
            var ret=this.targetselect(ptile,pthis,tmparr[1]).r;
            if(ret instanceof Tile) return ret;
            else return null;
          break;
          case "tileent":
            var ret=this.targetselect(ptile,pthis,tmparr[1]).r;
            if(ret instanceof Tile) return ret.ent();
            else return null;
          break;
          case "tileblock":
            var ret=this.targetselect(ptile,pthis,tmparr[1]).r;
            if(ret instanceof Tile) return ret.block();
            else return null;
          break;
          case "team":
            if(tmparr[1]==-1) return ptile.team;
            return Team.get(tmparr[1]);
          break;
          case "block":
          case "floor":
            return Blocks[tmparr[1]];
          break;
          case "item":
            return Items[tmparr[1]];
          break;
          case "bullet":
            return Bullets[tmparr[1]];
          break;
          case "liquid":
            return Liquids[tmparr[1]];
          break;
          case "fx":
            return Fx[tmparr[1]];
          break;
          case "seffect":
            return StatusEffects[tmparr[1]];
          break;
          case "js":
            if(tmparr[1]=="null") return null;
            if(tmparr[1]=="undefined") return;
            if(tmparr[1]=="this") return this;
          break;
        }
      }
      else return intarget;
    }
    else return intarget;
  },
  report(err){
    if(gamerule.commandBlockOutput) Call.sendMessage("C:"+err);
    if(gamerule.commandBlockTitle) Vars.ui.showInfoToast(err,7);
    print("C:"+err);
  },
  cmdeffect(punit,eff,duration,intensity,hidep){
    const potionlist=["speed","wither","slowness","strength","weakness","resistance","pain","poison","regeneration","instant_health","instant_damage"];
    if(potionlist.indexOf(eff.trim())<0){
      punit.applyEffect(StatusEffects[eff],duration);
      return;
    }
    if(effectextended.hasOwnProperty(eff+"-"+intensity+"-"+hidep)){
      punit.applyEffect(effectextended[eff+"-"+intensity+"-"+hidep],duration);//땜빵!
      return;
    }
    var seff= extendContent(StatusEffect,eff+"-"+intensity+"-"+hidep,{});
    var seffcolor= Color.valueOf("ffffff");
    switch(eff.trim()){
      case "speed":
        seff.speedMultiplier=intensity*0.1+1.1;
        seffcolor= Color.valueOf("7cafc6");
      break;
      case "slowness":
        seff.speedMultiplier=-1*intensity*0.05+0.95;
        seffcolor= Color.valueOf("5a6c81");
      break;
      case "strength":
        seff.damageMultiplier=intensity*0.1+1.1;
        seffcolor= Color.valueOf("932423");
      break;
      case "weakness":
        seff.damageMultiplier=-1*intensity*0.05+0.95;
        seffcolor= Color.valueOf("484d48");
      break;
      case "resistance":
        seff.armorMultiplier=intensity*0.2+1.1;
        seffcolor= Color.valueOf("99453a");
      break;
      case "pain":
        seff.armorMultiplier=-1*intensity*0.05+0.95;
        seffcolor= Color.valueOf("e49a3a");
      break;
      case "poison":
        seff.damage=0.05*intensity+0.05;
        seffcolor= Color.valueOf("4e9331");
      break;
      case "wither":
        seff.damage=0.1*intensity+0.1;
        seffcolor= Color.valueOf("352a27");
      break;
      case "regeneration":
        seff.damage=-0.01*intensity-0.01;
        if(seff.damage<-1) seff.damage=-1;
        seffcolor= Color.valueOf("cd5cab");
      break;
      case "instant_health":
        duration=1;
        seff.damage=-0.1*intensity-0.1;
        if(seff.damage<-1) seff.damage=-1;
        seffcolor= Color.valueOf("f82423");
      break;
      case "instant_damage":
        duration=1;
        seff.damage=10*intensity+10;
        seffcolor= Color.valueOf("430a09");
      break;
    }
    if(!hidep){
      var potion = newEffect(25, e => {
        Draw.color(seffcolor);
        Lines.stroke(e.fout() + 0.15);
        /*
        Angles.randLenVectors(e.id, 2, 6, (x, y) => {
          Lines.circle(e.x + x, e.y + y, 0.5 + e.fin() * 1.7);
        });
        */
        //new Floatc2({get: function(x, y){/*code*/}})
        Angles.randLenVectors(e.id, 2, 8.2, new Floatc2({get: function(x, y){Lines.circle(e.x + x, e.y + y, 0.5 + e.fin() * 1.8);}}));
      });
      seff.color=seffcolor;
      seff.effect=potion;
    }
    effectextended[eff+"-"+intensity+"-"+hidep]=seff;
    punit.applyEffect(seff,duration);
  },
  cmdtp(punit,cx,cy,facing,facingrelative){
    //um...
    var rot=0;
    if(facingrelative) rot=facing;
    else rot=facing-punit.rotation;
    punit.set(cx,cy);
    //if(rot!=0) punit.rotate(rot);
    if((punit instanceof Player)&&punit==Vars.player) Core.camera.position.set(punit);
  },
  command(tile,msg,parentthis,parentcmd,executed){
    if(msg.substring(0,1)!="/") msg="/"+msg;
    var argstmp = msg.substring(1).split('"');
    var args=[];
    for(var i=0;i<argstmp.length;i++){
      if(i%2==0){
        if(argstmp[i].trim()!=''){
          args=args.concat(argstmp[i].trim().split(' '));
        }
      }
      else{
        args.push(argstmp[i].trim());
      }
    }
    if(args.length==0){
      return false;
    }
    var cmd = args[0];
    args = args.splice(1);
    if(cmd=="execute"){
      cmd = args[0];
      args = args.splice(1);
    }
  try{
    switch(cmd){
      case 'overwrite':
        parentthis.setMessageBlockText(null,tile,args.join(' '));
        return true;
      break;
      case 'say':
        Call.sendMessage(args.join(' '));
        return true;
      break;
      case 'getpos':
        Call.sendMessage(tile.x+","+tile.y);
        return true;
      break;
      case 'title':
        if(args.length>=4){
          var tpos=this.tilde(tile,args[0],args[1]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //Vars.ui.tile(cx,cy).block().drawPlaceText(args.slice(3).join(" "), cx, cy, true);
            if(args[2]=="top"){
              Vars.ui.showInfoToast(args.slice(4).join(" "),args[3]);
            }
            else if(args[2]=="world"){
              ctile=Vars.world.tile(cx, cy);
              Vars.ui.showLabel(args.slice(4).join(" "),args[3],ctile.worldx(),ctile.worldy());
            }
            else{
              //if(!Vars.ui.hasOwnProperty(args[2])) throw "No such function";
              if(args.length==4) Vars.ui[args[2]](args[3]);
              else Vars.ui[args[2]](args[3],args[4]);
            }
            return true;
          }
          else throw "Coordinates should be above 0";
        }
        else throw "Missing params";
      break;
      case 'setblock':
        //Call.setTile(Vars.world.tile(tile.x, tile.y), Blocks.air, tile.team, rot);
        if(args.length>=3&&args.length<=6){
          var tpos=this.tilde(tile,args[0],args[1]); var cblock=args[2]; var crot=0; var cteam=tile.team;
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            var ctile=Vars.world.tile(cx,cy);
            if(ctile.block()==Blocks[cblock]) throw "Cannot set the block";
            if(args.length<=5||args[5]=="replace"||args[5]=="build"||args[5]=="destroy"||(args[5]=="keep"&&ctile.block()=="air")){
              //if(args.length==3) Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              if(args.length==4){
                if(args[3]>=0&&args[3]<=3) crot=args[3];
                else throw "Rotation should be 0~3";
              }
              if(args.length>=5){
                if(args[3]>=0&&args[3]<=3&&args[4]>=-1&&args[4]<=256){ crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team; }
                else throw "Rotation should be 0~3 and Team should be -1~256";
              }
              if(cteam!==tile.team) cteam=Team.get(cteam);
              if(args[5]=="build"||args[5]=="destroy"){
                if(Vars.world.tile(cx, cy).block().hasEntity()) Vars.world.tile(cx, cy).ent().damage(Vars.world.tile(cx, cy).ent().health()+1);
                Call.onDeconstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0);
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
              }
              else{
                if(Vars.world.tile(cx, cy).ent()) Vars.world.tile(cx, cy).ent().damage(Vars.world.tile(cx, cy).ent().health()+1);
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
                //Call.beginBreak(Vars.world.tile(cx, cy).team, cx, cy);
                /*
                var entity=Vars.world.tile(cx, cy).ent();
                Vars.world.tile(cx, cy).block().removed(Vars.world.tile(cx, cy));
                Vars.world.tile(cx, cy).remove();
                if(entity) entity.sleep();
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
                */
                //Vars.world.tile(cx, cy).ent().init(Vars.world.tile(cx, cy),true);
                //Vars.world.clearTileEntities();
              }
              if(args[5]=="build"){
                //Call.onDeconstructFinish(ctile, ctile.block(), 0);
                Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, false);
                Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              }else{

              }
              return true;
            }
            else if(args[5]=="force"){
              crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team;
              if(cteam!==tile.team) cteam=Team.get(cteam);
              //if(ctile.ent()!=null) ctile.ent().remove();
              Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              Vars.world.notifyChanged(Vars.world.tile(cx, cy));
              //Vars.world.tile(cx, cy).changed();
              return true;
            }
            else throw "Cannot set the block";
          }
          else{
            throw "Coordinates should be above 0";
          }
        }
        else throw "Missing params";
      break;
      case 'setblock2':
        //Call.setTile(Vars.world.tile(tile.x, tile.y), Blocks.air, tile.team, rot);
        if(args.length>=3&&args.length<=6){
          var tpos=this.tilde(tile,args[0],args[1]); var cblock=args[2]; var crot=0; var cteam=tile.team;
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            var ctile=Vars.world.tile(cx,cy);
            if(ctile.block()==Blocks[cblock]) throw "Cannot set the block";
            if(args.length<=5||args[5]=="replace"||args[5]=="build"||args[5]=="destroy"||(args[5]=="keep"&&ctile.block()=="air")){
              //if(args.length==3) Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              if(args.length==4){
                if(args[3]>=0&&args[3]<=3) crot=args[3];
                else throw "Rotation should be 0~3";
              }
              if(args.length>=5){
                if(args[3]>=0&&args[3]<=3&&args[4]>=-1&&args[4]<=256){ crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team; }
                else throw "Rotation should be 0~3 and Team should be -1~256";
              }
              if(cteam!==tile.team) cteam=Team.get(cteam);
              if(args[5]=="build"||args[5]=="destroy"){
                /*
                if(Vars.world.tile(cx, cy).block().hasEntity()) Vars.world.tile(cx, cy).ent().damage(Vars.world.tile(cx, cy).ent().health()+1);
                Call.onDeconstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0);
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
                */
                Call.beginBreak(Vars.world.tile(cx, cy).team, cx, cy);
                Call.onDeconstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0);
              }
              else{
                ctile.ent().health=-1;
                ctile.ent().remove();
                Call.setTile(ctile,Blocks[cblock], cteam, crot);
              }
              if(args[5]=="build"){
                //Call.onDeconstructFinish(ctile, ctile.block(), 0);
                Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, false);
                Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              }else{

              }
              return true;
            }
            else if(args[5]=="force"){
              crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team;
              if(cteam!==tile.team) cteam=Team.get(cteam);
              //if(ctile.ent()!=null) ctile.ent().remove();
              Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              Vars.world.notifyChanged(Vars.world.tile(cx, cy));
              //Vars.world.tile(cx, cy).changed();
              return true;
            }
            else throw "Cannot set the block";
          }
          else{
            throw "Coordinates should be above 0";
          }
        }
        else throw "Missing params";
      break;
      case 'at':
        if(args.length>=3){
          var tpos=this.tilde(tile,args[0],args[1]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //parentthis.drawPlaceText(args.slice(2).join(" "), cx, cy, true);
            return this.command(Vars.world.tile(cx,cy),args.slice(2).join(" "),parentthis,msg,true);
          }
          else throw "Coordinates should be above 0";
        }
        else throw "Missing params";
      break;
      case 'as':
        if(args.length>=2){
          var target=this.targetselect(tile,parentthis,args[0]);
          if(target.r==null) return false;
          else if(!target.a) return this.command(target.r,args.slice(1).join(" "),parentthis,msg,true);
          else{
            ret=true;
            target.r.each(cons(ent => {
              var res=this.command(ent,args.slice(1).join(" "),parentthis,msg,true);
              if(!res) ret=false;
            }));
            return ret;
          }
        }
        else throw "Missing params";
      break;
      case 'function':
      case 'f':
        if(executed){
          if(true){
            var cblock=tile;
            if(args.length==1) cblock[args[0]]();
            else if(args.length==2) cblock[args[0]](this.settype(tile,parentthis,args[1]));
            else if(args.length==3) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]));
            else if(args.length==4) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]));
            else if(args.length==5) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]),this.settype(tile,parentthis,args[4]));
            else throw "Missing params";
            return true;
          }
          else if(tile instanceof Unit){
            var cblock=tile;
            if(args.length==1) cblock[args[0]]();
            else if(args.length==2) cblock[args[0]](this.settype(tile,parentthis,args[1]));
            else if(args.length==3) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]));
            else if(args.length==4) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]));
            else throw "Missing params";
            return true;
          }
          else throw "Unidentified type";
        }
        else throw "This command is for /execute only";
      break;
      case 'functionblock':
      case 'fb':
        if(executed){
          if(tile instanceof Tile){
            var cblock=tile.block();
            if(args.length==1) cblock[args[0]]();
            else if(args.length==2) cblock[args[0]](this.settype(tile,parentthis,args[1]));
            else if(args.length==3) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]));
            else if(args.length==4) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]));
            else if(args.length==5) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]),this.settype(tile,parentthis,args[4]));
            else throw "Missing params";
            return true;
          }
          else throw "Executor must be a Tile type";
        }
        else throw "This command is for /execute only";
      break;
      case 'functionent':
      case 'fe':
        if(executed){
          if(tile instanceof Tile){
            var cblock=tile.ent();
            if(args.length==1) cblock[args[0]]();
            else if(args.length==2) cblock[args[0]](this.settype(tile,parentthis,args[1]));
            else if(args.length==3) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]));
            else if(args.length==4) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]));
            else if(args.length==5) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]),this.settype(tile,parentthis,args[4]));
            else throw "Missing params";
            return true;
          }
          else throw "Executor must be a Tile type";
        }
        else throw "This command is for /execute only";
      break;
      case 'particle':
      case 'fx':
        //var eff = Vars.effectGroup.all().toArray();
        //if(args.length==0) throw "Missing params";
        //var teff=eff[args[0]];
        if(args.length>=3&&args.length<=4){
          var tpos=this.tilde(tile,args[1],args[2]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x*Vars.tilesize; cy=tpos.y*Vars.tilesize;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //var ctile=Vars.world.tile(cx,cy);
            if(args.length==4) Effects.effect(Fx[args[0]],Color.valueOf(args[3]),cx,cy);
            else Effects.effect(Fx[args[0]],cx,cy);
            return true;
          }
          else throw "Coordinates should be above 0";
        }
        else if(args.length==1){
          if(tile instanceof Tile) Effects.effect(Fx[args[0]],tile.worldx(),tile.worldy());
          else Effects.effect(Fx[args[0]],tile.x,tile.y);
          return true;
        }
        else throw "Missing params";
      break;
      case 'gamerule':
        if(args.length==2){
          if(args[1]=="false") args[1]=false;
          if(gamerule.hasOwnProperty(args[0])){
            gamerule[args[0]]=args[1];
          }
          else if(args[0]=="waveSet"){
            Vars.state.wave=args[1];
          }
          else{
            Vars.state.rules[args[0]]=args[1];
          }
          return true;
        }
        else if(args.length==1){
          if(gamerule.hasOwnProperty(args[0])){
            this.report(gamerule[args[0]]);
            return gamerule[args[0]];
          }
          else if(args[0]=="waveSet"){
            this.report(Vars.state.wave);
            return Vars.state.wave;
          }
          else{
            this.report(Vars.state.rules[args[0]]);
            return Vars.state.rules[args[0]];
          }
        }
        else throw "Missing params";
      break;
      case 'give':
        if(args.length>=1&&args.length<=2){
          if(tile instanceof Tile){
            var amount=1;
            if(args.length==2) amount=args[1];
            if(amount<0){
              var ret=tile.block().removeStack(tile,Items[args[0]],-1*amount);
              if(ret>0) return true;
              else throw "No items to remove";
            }
            else{
              tile.block().handleStack(Items[args[0]],amount,tile,null);
              return true;
            }
          }
          else if(tile instanceof Unit){
            var amount=1;
            if(args.length==2) amount=args[1];
            if(amount<0) throw "Amount should be above 0";
            tile.addItem(Items[args[0]],amount);
          }
          else throw "This executor cannot receive items";
        }
        else throw "Missing params";
      break;
      case 'clear':
        if(args.length>=0){
          if(tile instanceof Tile&&args.length==1){
              var ret=tile.block().removeStack(tile,Items[args[0]],tile.block().itemCapacity+10);
              if(ret>0) return true;
              else throw "No items to remove";
          }
          else if(tile instanceof Unit&&args.length==0){
            tile.clearItem();
          }
          else throw "This executor cannot receive items";
        }
        else throw "Missing params";
      break;
      case 'kill':
        if(tile instanceof Unit&&args.length==0){
            tile.kill();
            return true;
        }
        else if(args.length==1){
            var target=this.targetselect(tile,parentthis,args[0]);
            if(target.a){
              var res=true;
              target.r.each(cons(ent => {
                  if (ent instanceof Unit) {
                      ent.kill();
                  }
                  else res=false;
              }));
              return res;
            }
            else if(target.r instanceof Unit){
              target.r.kill();
              return true;
            }
            else throw "This executor cannot be killed";
        }
        else throw "This executor cannot be killed";
      break;
      case 'configure':
        if(args.length>=2&&args.length<=3){
          var tpos=this.tilde(tile,args[0],args[1]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //Vars.ui.tile(cx,cy).block().drawPlaceText(args.slice(3).join(" "), cx, cy, true);
            var ctile=Vars.world.tile(cx,cy);
            if(ctile.block() instanceof Door){
              if(args.length==2){
                ctile.block().tapped(ctile,null);
              }
              else{
                if(args[2]=="true"||args[2]=="1"){
                  if(!ctile.ent().open){
                    ctile.block().tapped(ctile,null);
                  }
                  else throw "Failed to open door";
                }
                else{
                  if(ctile.ent().open){
                    ctile.block().tapped(ctile,null);
                  }
                  else throw "Failed to close door";
                }
              }
              return true;
            }
            else if(args.length==3){
              ctile.block().configured(ctile,null,args[2])
            }
            else "Coordinates should be above 0";
          }
          else throw "Coordinates should be above 0";
        }
        else throw "Missing params";
      break;
      case 'getflying':
        Vars.unitGroup.all().each(cons(ent => {
          if (ent instanceof FlyingUnit) {
            //print("flying " + ent);
            this.report("flying " + ent);
          }
        }));
        return true;
      break;
      case 'assert':
        if(gamerule.commandBlockOutput) Call.sendMessage(tile+" is asserting dominance!");
        if(gamerule.commandBlockTitle) Vars.ui.showInfoToast(tile+" is asserting dominance!",2);
        return true;
      break;
      case 'gethp':
        this.report(tile.health);
        return true;
      break;
      case 'getseffects':
        this.report(Vars.content.getBy(StatusEffect));
        return true;
      break;
      case 'getblocks':
        this.report(Vars.content.getBy(Block));
        return true;
      break;
      case 'effect':
        if(args.length>=2&&args.length<=5){
            var target=this.targetselect(tile,parentthis,args[0]);
            var eff=args[1]; var duration=1800;/* 30초 */ var intensity=0;/* 0레벨 세기 */ var hidep=false;
            if(args.length>=3) duration=args[2]*60;
            if(args.length>=4) intensity=Number(args[3]);
            if(args.length==5&&args[4]=="true") hidep=true; //"false"는 true로 인식되므로!
            if(target.a){
              var res=true;
              target.r.each(cons(ent => {
                  if (ent instanceof Unit) {
                      this.cmdeffect(ent,eff,duration,intensity,hidep);
                  }
                  else res=false;
              }));
              return res;
            }
            else if(target.r instanceof Unit){
              this.cmdeffect(target.r,eff,duration,intensity,hidep);
              return true;
            }
            else throw "This executor cannot be given the effect";
        }
        else throw "This executor cannot be given the effect";
      break;
      case 'playsound':
        if(args.length>=3&&args.length<=4){
          var tpos=this.tilde(tile,args[1],args[2]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x*Vars.tilesize; cy=tpos.y*Vars.tilesize;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //var ctile=Vars.world.tile(cx,cy);
            if(args.length==4) Vars.loops.play(Sounds[args[0]],Vec2(cx,cy),args[3]);
            else Vars.loops.play(Sounds[args[0]],Vec2(cx,cy),0.5);
            return true;
          }
          else throw "Coordinates should be above 0";
        }
        else if(args.length==1){
          if(tile instanceof Tile) Vars.loops.play(Sounds[args[0]],Vec2(tile.worldx(),tile.worldy()),0.5);
          else Vars.loops.play(Sounds[args[0]],Vec2(tile.x,tile.y),0.5);
          return true;
        }
        else throw "Missing params";
      break;
      case 'tp':
        if(args.length>=2&&args.length<=5){
            var target=this.targetselect(tile,parentthis,args[0]);
            var cx=0; var cy=0; var facing=0; var facingrelative=true;
            //편의상 월드xy 사용(유일)
            if(args.length==2){
              //tp target dest
              var dest=this.targetselect(tile,parentthis,args[1]);
              if(dest.a) throw "Cannot teleport to multiple destinations";
              if(dest.r instanceof Tile){
                cx=dest.r.worldx(); cy=dest.r.worldy();
              }
              else{
                cx=dest.r.x; cy=dest.r.y;
              }
            }
            else{
              var tpos=this.tilde(tile,args[1],args[2]);
              if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
                cx=tpos.x*Vars.tilesize; cy=tpos.y*Vars.tilesize;
                if(args.length==5&&args[3]=="facing"){
                  //tp target cx cy facing args[4]
                  if(args[4].substring(0,1)=="~"){
                    facing=Number(args[4].substring(1,args[4].length));
                    facingrelative=true;
                  }
                  else{
                    facing=Number(args[4]);
                    facingrelative=false;
                  }
                }
                else if(args.length==3){
                  //tp target cx cy
                }
                else throw "Incorrect params";
              }
              else if(args[2]=="facing"&&args.length==4){
                //tp target dest facing args[3]
                var dest=this.targetselect(tile,parentthis,args[1]);
                if(dest.a) throw "Cannot teleport to multiple destinations";
                if(dest.r instanceof Tile){
                  cx=dest.r.worldx(); cy=dest.r.worldy();
                }
                else{
                  cx=dest.r.x; cy=dest.r.y;
                }
                if(args[3].substring(0,1)=="~"){
                  facing=Number(args[3].substring(1,args[3].length));
                  facingrelative=true;
                }
                else{
                  facing=Number(args[3]);
                  facingrelative=false;
                }
              }
              else throw "Incorrect params";
            }
            if(isNaN(facing)) throw "Angle has to be a number";

            if(target.a){
              var res=true;
              target.r.each(cons(ent => {
                  if (ent instanceof Unit) {
                      this.cmdtp(ent,cx,cy,facing,facingrelative);
                  }
                  else res=false;
              }));
              return res;
            }
            else if(target.r instanceof Unit){
              this.cmdtp(target.r,cx,cy,facing,facingrelative);
              return true;
            }
            else throw "This target is not teleportable";
        }
        else throw "Missing params";
      break;
      default:
        return false;
    }
  }
  catch(err){
    if(gamerule.commandBlockOutput) Call.sendMessage("E:"+err);
    if(gamerule.commandBlockTitle) Vars.ui.showInfoToast(err,7);
    print("E:"+err);
    return false;
  }
  }
};
this.global.commandblocks=commandblocks;
