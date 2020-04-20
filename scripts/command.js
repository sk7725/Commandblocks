/*const commandblocks={
  tilde(tile,inx,iny){
    var tmpobj={}; tmpobj.x=inx; tmpobj.y=iny;
    if(inx=="~") tmpobj.x=tile.x;
    else if(inx.substring(0,1)=="~") tmpobj.x=Number(inx.substring(1,inx.length))+tile.x;
    if(iny=="~") tmpobj.y=tile.y;
    else if(iny.substring(0,1)=="~") tmpobj.y=Number(iny.substring(1,iny.length))+tile.y;
    return tmpobj;
  },
  targetselect(ptile,pthis,intarget){
    if(intarget.includes("{")){
      return JSON.parse(intarget);
    }
    else if(intarget.includes("[")){
      //TBA:selector
    }
    else if(intarget.includes(",")){
      var tmparr=intarget.trim().split(",");
      if(tmparr.length==2&&){
        var ta=this.tilde(ptile,tmparr[0],tmparr[1]);
        if(isNaN(ta.x)&&!isNaN(ta.y)){
          return Vars.world.tile(ta.x,ta.y);
        }
        else return tmparr;
      }
      else return tmparr;
    }
    else{
      switch(intarget.trim()){
        case "@s":
          return ptile;
        break;
        case "@t":
          return pthis;
        break;
        default:
          return intarget;
      }
    }
  },
  command(tile,msg,parentthis,parentcmd,executed,executortype){
    var mytype="tile";
    if(tile instanceof Tile) mytype="tile";
    if(tile instanceof Block) mytype="block";
    if(tile instanceof Unit) mytype="unit";
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
            if(args.length<=5||args[5]=="replace"||args[5]=="destroy"||(args[5]=="keep"&&ctile.block()=="air")){
              //if(args.length==3) Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              if(args.length==4){
                if(args[3]>=0&&args[3]<=3) crot=args[3];
                else throw "Rotation should be 0~3";
              }
              if(args.length>=5){
                if(args[3]>=0&&args[3]<=3&&args[4]>=-1&&args[4]<=256){ crot=args[3];cteam=args[4];if(cteam==-1){cteam=tile.team;}}
                else throw "Rotation should be 0~3 and Team should be 0~256";
              }
              //Vars.world.tile(cx, cy).block().removed(Vars.world.tile(cx, cy));
              //Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              //ctile.block().removed(ctile);
              if(args[5]=="destroy"){
                Call.onDeconstructFinish(ctile, ctile.block(), 0);
              }
              else{
                ctile.remove();
              }
              Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, false);
              Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              Events.fire(new BlockBuildEndEvent(Vars.world.tile(cx, cy), null, cteam, false));
            }
            else if(args[5]=="force"){
              //ctile.block().removed(ctile);
              crot=args[3];
              cteam=args[4]; if(cteam==-1) cteam=tile.team;
              ctile.remove();
              Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, true);
              Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              Events.fire(new BlockBuildEndEvent(Vars.world.tile(cx, cy), null, cteam, false));
            }
            else if(args[5]=="bruteforce"){
              Call.setNet(Vars.world.tile(cx, cy), Blocks[cblock], cteam, crot);
            }
            else throw "Cannot set the block";
          }
          else{
            throw "Coordinates should be above 0";
          }
        }
        else throw "Missing params";
      break;
      case 'function':
        if(executed&&mytype=="tile"){
          var ret=false;
          if(args.length==1){
            var res=tile.block()[args[0]]();
            if(res===undefined) ret=true;
            if(!res) ret=false;
            else ret=true;
          }
          else if(args.length==2){
            args[1]=this.targetselect(tile,this,args[1]);
            var res=tile.block()[args[0]](args[1]);
            if(res===undefined) ret=true;
            if(!res) ret=false;
            else ret=true;
          }
          else if(args.length==3){
            args[1]=this.targetselect(tile,this,args[1]);
            args[2]=this.targetselect(tile,this,args[2]);
            var res=tile.block()[args[0]](args[1],args[2]);
            if(res===undefined) ret=true;
            if(!res) ret=false;
            else ret=true;
          }
          else if(args.length==4){
            args[1]=this.targetselect(tile,this,args[1]);
            args[2]=this.targetselect(tile,this,args[2]);
            args[3]=this.targetselect(tile,this,args[3]);
            var res=tile.block()[args[0]](args[1],args[2],args[3]);
            if(res===undefined) ret=true;
            if(!res) ret=false;
            else ret=true;
          }
          else throw "Missing params";
          return ret;
        }
        else throw "THis command is for /execute only";
      break;
      case 'execute':
        if(args.length>2){
          if(args[0]=="at"){
            if(args.length>=5){
              var ctile=this.targetselect(args[1]+","+args[2]);
              if(args[3]=="run"){
                return this.command(ctile,args.slice(4).join(" "),parentthis,msg,true,mytype);
              }
              else throw "Incorrect params";
            }
          }
          else if(args[0]=="as"){
            if(args.length>=4){
              var ctile=this.targetselect(args[1]);
              if(args[2]=="run"){
                return this.command(ctile,args.slice(3).join(" "),parentthis,msg,true,mytype);
              }
              else throw "Incorrect params";
            }
          }
          else throw "Incorrect params";
        }
        else throw "Missing params";
      break;
      case 'debug':
        if(args.length>0){
          switch(args[0]){
            case 'ts':
            case 'targetselect':
              Call.sendMessage(this.targetselect(tile,this,args[1]));
              return true;
            break;
            case 'ti':
            case 'tilde':
              Call.sendMessage(this.tilde(tile,args[1],args[2]));
              return true;
            break;
            default:
              throw "Incorrect params";
          }
        }
        else throw  "Missing params";
      break;
      default:
        return false;
    }
  }
  catch(err){
    Call.sendMessage("E:"+err);
    return false;
  }
  }
};
this.global.commandblocks=commandblocks;
*/
if(!this.global.hasOwnProperty("commandcached")) this.global.commandcached={};
const commandcached=this.global.commandcached;
const commandblocks={
  tilde(tile,inx,iny){
    var tmpobj={}; tmpobj.x=inx; tmpobj.y=iny;
    if(inx=="~") tmpobj.x=tile.x;
    else if(inx.substring(0,1)=="~") tmpobj.x=Number(inx.substring(1,inx.length))+tile.x;
    if(iny=="~") tmpobj.y=tile.y;
    else if(iny.substring(0,1)=="~") tmpobj.y=Number(iny.substring(1,iny.length))+tile.y;
    return tmpobj;
  },
  targetselect(ptile,pthis,intarget){
    if(typeof intarget!="string") return intarget;
    if(intarget.substring(0,2)=="@p"){
      var selectors=[];
      var steam=ptile.team; var sr=100;
      if(intarget.substring(0,3)=="@p["&&intarget.substring(intarget.length-1,intarget.length)=="]"){
        selectors=intarget.substring(3,intarget.length-1).split(",");
      }
      for(var i=0;i<selectors.length;i++){
        var tmparr=selectors[i].split("=");
        switch(tmparr[0]){
          case "team":
            steam=Team.get(tmparr[1]);
          break;
          case "r":
            sr=tmparr[1];
          break;
        }
      }
      //return Units.closest(tile.getTeam(), tile.drawx(), tile.drawy(), repairRadius,unit -> unit.health < unit.maxHealth());
      if(ptile instanceof Tile) ptile.block().Units.closest(steam, ptile.drawx(), ptile.drawy(), sr,true);
    }
    else if(intarget.substring(0,2)=="@c"){
      var tag="NOTAG";
      if(intarget.substring(0,3)=="@c["&&intarget.substring(intarget.length-1,intarget.length)=="]"){
        tag=intarget.substring(3,intarget.length-1);
      }
      if(commandcached.hasOwnProperty(tag)) return commandcached[tag];
      else return null;
    }
    else if(intarget.includes(",")){
      var tmparr=intarget.split(",");
      if(tmparr.length==2){
        var ta=this.tilde(ptile,tmparr[0],tmparr[1]);
        if(isNaN(ta.x)&&!isNaN(ta.y)){
          return Vars.world.tile(ta.x,ta.y);
        }
        else return tmparr;
      }
      else return tmparr;
    }
    else{
      switch(intarget){
        case "@s":
          return ptile;
        break;
        case "@t":
          return pthis;
        break;
        default:
          return intarget;
      }
    }
  },
  settype(ptile,pthis,intarget){
    if(intarget.includes(":")){
      var tmparr=intarget.split(":");
      if(tmparr.length==2){
        switch(tmparr[0]){
          case "array":
            return this.targetselect(ptile,pthis,tmparr[1]);
          break;
          case "tile":
            var ret=this.targetselect(ptile,pthis,tmparr[1]);
            if(ret instanceof Tile) return ret;
            else return null;
          break;
          case "team":
            if(tmparr[1]==-1) return ptile.team;
            return Team.get(tmparr[1]);
          break;
          case "block":
          case "floor":
            return Blocks[intarget];
          break;
        }
      }
      else return intarget;
    }
    else return intarget;
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
      case 'title':
        if(args.length>=3){
          var tpos=this.tilde(tile,args[0],args[1]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            Vars.world.tile(cx,cy).block().drawPlaceText(args.slice(2).join(" "), cx, cy, true);
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
            cx=Math.floor(tpos.x); cy=Math.floor(tpos.y);
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
              //Vars.world.tile(cx, cy).block().removed(Vars.world.tile(cx, cy));
              //Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              //ctile.block().removed(ctile);
              if(args[5]=="build"||args[5]=="destroy"){
                Vars.world.tile(cx, cy).block().onDestroyed(Vars.world.tile(cx, cy));
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
                //if(Vars.world.tile(cx, cy).hasEntity()) Vars.world.tile(cx, cy).ent().damage(Vars.world.tile(cx, cy).ent().health()+1);
                //Vars.world.tile(cx, cy).removeNet();
              }
              else{
                if(Vars.world.tile(cx, cy).block().hasEntity()) Vars.world.tile(cx, cy).ent().damage(Vars.world.tile(cx, cy).ent().health()+1);
                Vars.world.tile(cx, cy).setBlock(Blocks[cblock], cteam, crot);
                //Vars.world.tile(cx, cy).block().onDestroyed(Vars.world.tile(cx, cy));
                //ctile.preChanged();
                //if(Vars.world.tile(cx, cy).ent()) Vars.world.tile(cx, cy).ent().setDead(true);
                //if(Vars.world.tile(cx, cy).ent()) Vars.world.tile(cx, cy).ent().onDeath();
                //if(Vars.world.tile(cx, cy).ent()) Vars.world.tile(cx, cy).ent().kill();
                //Vars.world.tile(cx, cy).block().removed(Vars.world.tile(cx, cy));
                //Vars.world.tile(cx, cy).remove();
                //if(Vars.world.tile(cx, cy).ent()) Vars.world.tile(cx, cy).ent().remove();
                //Vars.world.tile(cx, cy).changed();
                //Call.setTile(Vars.world.tile(cx, cy), Blocks.air, tile.team, 0);
              }
              if(args[5]=="build"){
                //Call.onDeconstructFinish(ctile, ctile.block(), 0);
                Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, false);
                Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              }else{

              }
              return true;
              //
              //Events.fire(new BlockBuildEndEvent(Vars.world.tile(cx, cy), null, cteam, false));
            }
/*
            else if(args[5]=="force"){
              crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team;
              if(cteam!==tile.team) cteam=Team.get(cteam);
              ctile.block().removed(ctile);
              ctile.remove();
              Call.onConstructFinish(Vars.world.tile(cx, cy), Blocks[cblock], 0, crot, cteam, true);
              Vars.world.tile(cx, cy).block().placed(Vars.world.tile(cx, cy));
              //Events.fire(new BlockBuildEndEvent(Vars.world.tile(cx, cy), null, cteam, false));
            }
*/
            else if(args[5]=="force"){
              crot=args[3];cteam=args[4];if(cteam==-1) cteam=tile.team;
              if(cteam!==tile.team) cteam=Team.get(cteam);
              if(ctile.ent()!=null) ctile.ent().remove();
              Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              Vars.world.tile(cx, cy).changed();
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
          var target=this.targetselect(tile,parentthis,args[0]),args.slice(1).join(" ");
          if(target==null) return false;
          return this.command(target,parentthis,msg,true);
        }
        else throw "Missing params";
      break;
      case 'function':
      case 'f':
        if(executed){
          if(tile instanceof Tile){
            var cblock=tile;
            if(args.length==1) cblock[args[0]]();
            else if(args.length==2) cblock[args[0]](this.settype(tile,parentthis,args[1]));
            else if(args.length==3) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]));
            else if(args.length==4) cblock[args[0]](this.settype(tile,parentthis,args[1]),this.settype(tile,parentthis,args[2]),this.settype(tile,parentthis,args[3]));
            else throw "Missing params";
            return true;
          }
          else throw "WIP";
        }
        else throw "This command is for /execute only";
      break;
      case 'particle':
      case 'fx':
        if(args.length>=3&&args.length<=4){
          var tpos=this.tilde(tile,args[1],args[2]);
          var cx=0; var cy=0;
          if(!isNaN(Number(tpos.x))&&!isNaN(Number(tpos.y))){
            cx=tpos.x; cy=tpos.y;
          }
          else throw "Coordinates should be above 0";
          if(cx>=0&&cy>=0){
            //var ctile=Vars.world.tile(cx,cy);
            if(args.length==4) Effects.effect(Effects.getEffect(args[0]),Color[args[3]],cx,cy);
            else Effects.effect(Effects.getEffect(args[0]),cx,cy);
            return true;
          }
          else throw "Coordinates should be above 0";
        }
        else if(args.length==1){
          Effects.effect(Effects.getEffect(args[0]),tile.x,tile.y);
          return true;
        }
        else throw "Missing params";
      break;
      default:
        return false;
    }
  }
  catch(err){
    Call.sendMessage("E:"+err);
    return false;
  }
  }
};
this.global.commandblocks=commandblocks;
