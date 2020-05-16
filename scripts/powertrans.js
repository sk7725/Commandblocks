const presstick=1; const timerid=0; const loopthresh=150;
var gloops=500;//crash it if you can idk
const color1=Color.valueOf("ffaa5f"); const color2=Color.valueOf("84f491");//color of pyratite and mender
const coloroff=Color.valueOf("6974c4");
const powertrans=extendContent(PowerBlock,"powertrans",{
  placed(tile) {
      this.super$placed(tile);
  },
 /*
  logiccheck(tile,in1,in2){
    if(tile.ent().timer.getTime(timerid)<=0){
      if(gloops>loopthresh){
        Vars.ui.showInfoToast("Do not overuse!",1);
        return false;
      }
      else{
        gloops+=1;
        return tile.ent().getLastOutput();
      }
      //print("Looping:"+tile.ent().getLoops());
    }
    gloops=0;
    tile.ent().timer.reset(timerid,0);
    if(in1.getPowerProduced()-in1.getPowerNeeded()>0) in1=true;
    else in1=false;
    if(in2.getPowerProduced()-in2.getPowerNeeded()>0) in2=true;
    else in2=false;
    //print("LG INPUTS:"+in1+","+in2);
    var input=-1;
    if(in1&&in2) input=0;
    else if(in1&& (!in2)) input=1;
    else if(in2) input=2;
    else input=3;
    //var tmparr=[];
    //tmparr.push(in1); tmparr.push(in2);
    //var input=logict.indexOf(tmparr);
    //print("LG INPUT:"+input);
    //print("LG LIST:"+tmparr);
    var logicn=tile.ent().message.split("-");
    //if(logicn.indexOf(input)<0) return false;
    tile.ent().setLastOutput((Number(logicn[input])==0)?false:true);
    return (Number(logicn[input])==0)?false:true;
  },
  */
  /*
  getPowerProduction(tile){
    //if(tile.ent().message=="") this.setMessageBlockText(null,tile,"1-1-1-0");
    var tx1=0; var ty1=0; var tx2=0; var ty2=0;
    if(tile.rotation()==0){
      tx1=-1; ty1=1;
      tx2=-1; ty2=-1;
    }
    else if(tile.rotation()==1){
      tx1=-1; ty1=-1;
      tx2=1; ty2=-1;
    }
    else if(tile.rotation()==2){
      tx1=1; ty1=-1;
      tx2=1; ty2=1;
    }
    else if(tile.rotation()==3){
      tx1=1; ty1=1;
      tx2=-1; ty2=1;
    }
    var in1=Vars.world.tile(tile.x+tx1,tile.y+ty1);
    var in2=Vars.world.tile(tile.x+tx2,tile.y+ty2);
    //var in1=tile.getNearby((tile.rotation()+1)%4);
    //var in2=tile.getNearby((tile.rotation()+3)%4);
    //if(!((in1.ent().hasOwnProperty("power"))&&(in2.ent().hasOwnProperty("power")))) return 0;
    try{
      if(in1.ent().power.graph.getID()==tile.ent().power.graph.getID()||in2.ent().power.graph.getID()==tile.ent().power.graph.getID()){
        Vars.ui.showInfoToast("Do not connect output with input!",1);
        return 0;
      }
      //Vars.ui.showInfoToast(this.logiccheck(tile,in1.ent().power.graph.getPowerBalance(),in2.ent().power.graph.getPowerBalance()),1);
      return (this.logiccheck(tile,in1.ent().power.graph,in2.ent().power.graph)) ? 1: 0;
    }
    catch(err){
      return 0;
    }
  },
  configured(tile,player,value){
    //if(!value) return;
    if(value>=0&&value<16) Call.setMessageBlockText(null,tile,Math.floor(value/8)%2+"-"+Math.floor(value/4)%2+"-"+Math.floor(value/2)%2+"-"+Math.floor(value)%2);
    if(value>=16&&value<20){
      var args=tile.ent().message.split("-");
      args[value-16]=1-args[value-16];
      Call.setMessageBlockText(null,tile,args.join("-"));
    }
  },
  */
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find("commandblocks-powerlogicg-base");
    this.topRegion=Core.atlas.find(this.name+"-1");
    this.topRegionOff=Core.atlas.find(this.name+"-0");
    this.laser=Core.atlas.find("laser");
    this.laserEnd=Core.atlas.find("laser-end");
    this.t1=new Vec2(); this.t2=new Vec2();
  },
  drawConfigure(tile){
    var tx1=0; var ty1=0;
    if(tile.rotation()==0){
      tx1=-1; ty1=1;
    }
    else if(tile.rotation()==1){
      tx1=-1; ty1=-1;
    }
    else if(tile.rotation()==2){
      tx1=1; ty1=-1;
    }
    else if(tile.rotation()==3){
      tx1=1; ty1=1;
    }
    var in1=Vars.world.tile(tile.x+tx1,tile.y+ty1);
    //var in2=Vars.world.tile(tile.x+tx2,tile.y+ty2);
    Draw.color(color1);
    Lines.square(in1.drawx(), in1.drawy(),1 * Vars.tilesize / 2 + 1);
    //Draw.color(color2);
    //Lines.square(in2.drawx(), in2.drawy(),1 * Vars.tilesize / 2 + 1);
    this.super$drawConfigure(tile);
  },
  checkState(tile){
    var tx1=0; var ty1=0;
    if(tile.rotation()==0){
      tx1=-1; ty1=1;
    }
    else if(tile.rotation()==1){
      tx1=-1; ty1=-1;
    }
    else if(tile.rotation()==2){
      tx1=1; ty1=-1;
    }
    else if(tile.rotation()==3){
      tx1=1; ty1=1;
    }
    var in1=Vars.world.tile(tile.x+tx1,tile.y+ty1);
    if(!(in1.ent().hasOwnProperty("power"))) return false;
    try{
      if(in1.getPowerProduced()-in1.getPowerNeeded()>0) return true;
      else return false;
    }
    catch(err){
      return false;
    }
  },
  draw(tile){
    //this.super$draw(tile);
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.rect((tile.ent().getState())?this.topRegion:this.topRegionOff, tile.drawx(), tile.drawy(),90*tile.rotation());
    //Draw.rect(Core.atlas.find(this.name+"-"+tile.ent().message), tile.drawx(), tile.drawy(),90*tile.rotation());
  },
  update(tile){
    //this.super$update(tile);
    var state=this.checkState(tile);
    if(state){
      //reconnect
      var links=tile.ent().getOffLink();
      for(var i=0;i<links.length;i++){
        var other=Vars.world.tile(links[i]);
        if(other.block() instanceof PowerNode) other.block().configured(other,null,tile.pos());
      }
      tile.ent().resetOffLink();
    }
    else{
      //disconnect
      var links=tile.entity.power.links.toArray();//links.get(i), links.size
      for(var i=0;i<links.length;i++){
        //if(links.get(i)==tile.pos()) continue;
        var other=Vars.world.tile(links[i]);
        if(other.block() instanceof PowerNode){
          other.block().configured(other,null,tile.pos());
          tile.ent().toggleOffLink(links[i]);
        }
      }
    }
    this.super$update(tile);
  },
  drawLaser(tile,target){
    var opacityPercentage = Core.settings.getInt("lasersopacity");
    if(opacityPercentage == 0) return;
    var opacity = opacityPercentage / 100;

    var x1 = tile.drawx(); var y1 = tile.drawy();
    var x2 = target.drawx(); var y2 = target.drawy();

    var angle1 = Angles.angle(x1, y1, x2, y2);
    this.t1.trns(angle1, tile.block().size * Vars.tilesize / 2 - 1.5);
    this.t2.trns(angle1 + 180, target.block().size * Vars.tilesize / 2 - 1.5);

    x1 += this.t1.x;
    y1 += this.t1.y;
    x2 += this.t2.x;
    y2 += this.t2.y;

    //float fract = 1f - tile.entity.power.graph.getSatisfaction();

    Draw.color(Color.white, coloroff, 0.86);
    Draw.alpha(opacity);
    Drawf.laser(this.laser, this.laserEnd, x1, y1, x2, y2, 0.25);
    Draw.color();
  },
  drawLayer(tile){
    if(Core.settings.getInt("lasersopacity") == 0) return;
    //var entity=tile.ent();
    var links=tile.ent().getOffLink();
    for(var i=0; i<links.length; i++){
      var link = Vars.world.tile(links[i]);
      if(!(link.block() instanceof PowerNode)) continue;
      this.drawLaser(tile, link);
    }
    Draw.reset();
  }
});

powertrans.entityType=prov(() => extend(TileEntity , {
  getOffLink(){
    return this._offlink;
  },
  addOffLink(a){
    if(this._offlink.indexOf(a)<0) this._offlink.push(a);
  },
  toggleOffLink(a){
    var i=this._offlink.indexOf(a);
    if(i<0) this._offlink.push(a);
    else this._offlink.splice(i,1);
  },
  resetOffLink(){
    this._offlink=[];
  },
  _offlink:[],
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._offlink.length);
    for(var i=0;i<this._offlink.length;i++){
      stream.writeInt(this._offlink[i]);
    }
    //stream.writeBoolean(this._state);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this.resetOffLink();
    var amount=stream.readShort();
    for(var i=0;i<amount;i++){
      this.addOffLink(stream.readInt());
    }
    //this._state=stream.readBoolean();
  }
}));
