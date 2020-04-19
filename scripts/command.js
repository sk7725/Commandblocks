const commandblocks={
  tilde(tile,inx,iny){
    var tmpobj={}; tmpobj.x=inx; tmpobj.y=iny;
    if(inx=="~") tmpobj.x=tile.x;
    else if(inx.substring(0,1)=="~") tmpobj.x=Number(inx.substring(1,inx.length))+tile.x;
    if(iny=="~") tmpobj.y=tile.y;
    else if(iny.substring(0,1)=="~") tmpobj.y=Number(iny.substring(1,iny.length))+tile.y;
    return tmpobj;
  },
  targetselect(tile,intarget){

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
              if(args.length==5){
                if(args[3]>=0&&args[3]<=3&&args[4]>=0&&args[4]<=256){ crot=args[3];cteam=args[4]; }
                else throw "Rotation should be 0~3 and Team should be 0~256";
              }
              //Vars.world.tile(cx, cy).block().removed(Vars.world.tile(cx, cy));
              //Vars.world.tile(cx, cy).setNet(Blocks[cblock], cteam, crot);
              ctile.block().removed(ctile);
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
              ctile.block().removed(ctile);
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
        else{
          Call.sendMessage("E:Missing params.");
          return false;
        }
      break;
      case 'function':
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
