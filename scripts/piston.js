const pushInvalid = ["commandblocks-commandb", "thorium-wall", "thorium-wall-large", "commandblocks-researchskill", "commandblocks-enderbox", "commandblocks-enderchest", "commandblocks-pistonarm", "commandblocks-wallinvi", "commandblocks-wallinvilarge"];
var nonSticky = ["phase-wall", "phase-wall-large"];
nonSticky = nonSticky.concat(pushInvalid);
//const pistonArm = Blocks.copperWall;
const slimeBlock = ["commandblocks-sporeblock", "commandblocks-tensorbind"];
const slimeDir = ["commandblocks-sporedir", "commandblocks-tensordir"];
nonSticky = nonSticky.concat(slimeBlock);
const pistonBlock = ["commandblocks-piston", "commandblocks-pistonsticky"];
//print(nonSticky);
var pushArray = [];
var slimeArray = [];

function getTileDist(mtile, r, dist){
  var tmptile = mtile;
  if(dist<0){
    dist = -1*dist;
    r = (r+2)%4;
  }
  for(var i=0;i<dist;i++){
    if(tmptile == null) return tmptile;
    tmptile = tmptile.getNearby(r);
  }
  return tmptile;
}

function getFrontBlocks(mtile, r){
  var retarr = [];
  const s = mtile.block().size;
  if(s%2 == 1){
    const center = getTileDist(mtile, r, (s-1)/2+1);
    for(var i=0;i<s;i++){
      var ptile = getTileDist(center, (r+1)%4, (s-1)/2-i);
      if(ptile == null) retarr.push(ptile);
      else{
        if(retarr.indexOf(ptile.link())<0 && ptile.link().block().name != "air") retarr.push(ptile.link());
      }
    }
  }
  else{
    if(r==0){
      for(var i=0;i<s;i++){
        var ptile = Vars.world.tile(mtile.x+s/2+1, mtile.y+i-s/2+1);
        if(ptile == null) retarr.push(ptile);
        else{
          if(retarr.indexOf(ptile.link())<0 && ptile.link().block().name != "air") retarr.push(ptile.link());
        }
      }
    }
    else if(r==1){
      for(var i=0;i<s;i++){
        var ptile = Vars.world.tile(mtile.x+i-(s/2)+1, mtile.y+s/2+1);
        if(ptile == null) retarr.push(ptile);
        else{
          if(retarr.indexOf(ptile.link())<0 && ptile.link().block().name != "air") retarr.push(ptile.link());
        }
      }
    }
    else if(r==2){
      for(var i=0;i<s;i++){
        var ptile = Vars.world.tile(mtile.x-s/2, mtile.y+i-s/2+1);
        if(ptile == null) retarr.push(ptile);
        else{
          if(retarr.indexOf(ptile.link())<0 && ptile.link().block().name != "air") retarr.push(ptile.link());
        }
      }
    }
    else{
      for(var i=0;i<s;i++){
        var ptile = Vars.world.tile(mtile.x+i-(s/2)+1, mtile.y-s/2);
        if(ptile == null) retarr.push(ptile);
        else{
          if(retarr.indexOf(ptile.link())<0 && ptile.link().block().name != "air") retarr.push(ptile.link());
        }
      }
    }
    //fuck
  }
  //print(retarr);
  return retarr;
}
function canBreakBlock(ptile){
  return ptile.block().canBreak(ptile);
}

function canPush(ptile){
  if(ptile.block().name == "air") return true;
  return (pushInvalid.indexOf(ptile.block().name) < 0)&&ptile.breakable()&&canBreakBlock(ptile);
}

function canPushPiston(r, ptile, count){
  if(pistonBlock.indexOf(ptile.block().name)<0 || !ptile.ent().extended() || (ptile.rotation()-r+4)%4 == 2){
    print("Cond 1:"+pistonBlock.indexOf(ptile.block().name));
    print("Cond 3: "+(ptile.rotation()-r+4)%4);
    return true;
  }
  var etile = ptile.front();
  if(etile == null) return true;
  etile = etile.getNearby(r);
  if(etile == null || count>999) return false;
  if(etile.block().name == "air"||etile==ptile) return true;
  if(!canPush(ptile.link()) || !canPushPiston(r, etile, count)) return false;
  return addBlock(r, etile.link(), count);
}

function canStick(ptile, origTile){
  var orig = origTile.block().name;
  var slimet = slimeType(ptile.block().name);
  return ((nonSticky.indexOf(ptile.block().name) < 0)&&ptile.breakable()&&canBreakBlock(ptile)&&(slimet == orig || slimet == ptile.block().name || ptile.front().link() != origTile)) || (ptile.block().name == slimeType(orig) && slimeBlock.indexOf(slimeType(orig))>-1);
}

function slimeType(name){
  if(name == "commandblocks-sporedir") return "commandblocks-sporeblock";
  if(name == "commandblocks-tensordir") return "commandblocks-tensorbind";
  return name;
}

function getLowest(r, stile, count){
  var ret = stile;
  if(!(slimeBlock.indexOf(stile.block().name) > -1 || (slimeDir.indexOf(stile.block().name) > -1 && (stile.rotation()-r+4)%4 == 2))) return stile.link();
  for(var i=0;i<999-count;i++){
    var etile = stile.getNearby((r+2)%4);
    if(etile == null || etile.block().name == "air" || pushArray.indexOf(etile) > -1 || !canStick(etile, stile) || !canPushPiston(r, etile, count)) return stile;
    if(slimeBlock.indexOf(etile.block().name) > -1 || (slimeDir.indexOf(etile.block().name) > -1 && (etile.rotation()-r+4)%4 == 2)) stile = etile;//for 2x2 slimes add .link()
    else return etile.link();
  }
}

function addSide(r, stile, count, orig){
  if(stile == null || count > 999) return false;
  if(stile.link() == null) return false;
  stile = stile.link();
  if(stile.block().name == "air" || pushArray.indexOf(stile) > -1 || slimeArray.indexOf(stile) > -1 ||  !canPush(stile) || !canStick(stile, orig) || !canPushPiston(r, stile, count)) return true;
  return addBlock(r, getLowest(r, stile, count), count);
}

function addBlock(r, stile, count){
  if(stile == null) return false;
  var pusharr = getFrontBlocks(stile, r);
  if(slimeBlock.indexOf(stile.block().name) > -1){
    slimeArray.push(stile);
    var retSide = addSide(r, stile.getNearby((r+1)%4), count, stile);
    if(!retSide) return false;
    retSide = addSide(r, stile.getNearby((r+3)%4), count, stile);
    if(!retSide) return false;
  }
  else if(slimeDir.indexOf(stile.block().name) > -1&&(stile.rotation()-r+4)%2==1){
    slimeArray.push(stile);
    var retSide = addSide(r, stile.getNearby(stile.rotation()), count, stile);
    if(!retSide) return false;
  }
  if(count + pusharr.length>999) return false;
  if(count<999){
    for(var i=0;i<pusharr.length;i++){
      if(pusharr[i] == null || !canPush(pusharr[i]) || !canPushPiston(r, pusharr[i], count)) return false;
      var ret = addBlock(r, pusharr[i], ++count);
      if(!ret) return false;
    }
  }
  if(pushArray.indexOf(stile)<0) pushArray.push(stile);
  return true;
}

function pushUnits(stile, r){
  if(!stile.solid()) return;
  const v1 =Vec2(Vars.tilesize,0).setAngle(r*90);
  const s = stile.block().size*Vars.tilesize;
  Units.nearby(stile.worldx()-s/2+v1.x, stile.worldy()-s/2+v1.y, s, s, cons(u=>{
    //print(u);
    if(!u.isFlying()){
      u.move(v1.x, v1.y);
      if(slimeBlock.indexOf(stile.block().name)>-1) u.velocity().set(v1.x*6.5*Time.delta(), v1.y*6.5*Time.delta());
    }
  }));
}

function pushBlock(tile, stile){
  /*
  if(stile == null || pushArray.indexOf(stile)>-1) return false;
  var pusharr = getFrontBlocks(stile, tile.rotation());
  if(count + pusharr.length>999) return false;
  if(count<999){
  for(var i=0;i<pusharr.length;i++){
  if(pusharr[i] == null || pushInvalid.indexOf(pusharr[i].block().name)>-1) return false;
  var ret = pushBlock(tile, pusharr[i], ++count);
  if(!ret) return false;
  }
  }*/
  pushUnits(stile, tile.rotation());
  var etile = stile.getNearby(tile.rotation());
  //pushUnits(stile, tile.rotation());
  const block = stile.block();
  const r = stile.rotation();
  const team = stile.getTeam();
  var slinks = [];
  if(etile == null) return;
  if(stile.ent() != null){
    if(stile.block().hasPower){
      slinks = stile.ent().power.links.toArray();
      for(var i=0;i<slinks.length;i++){
        if(Vars.world.tile(slinks[i]).block() instanceof PowerNode){
          Vars.world.tile(slinks[i]).configure(stile.pos());
        }
      }
    }

    stile.ent().removeFromProximity();
    const entCopy = stile.ent();
    stile.entity = null;
  }
  stile.remove();

  etile.set(block, team, r);

  if(etile.ent() != null){
    etile.ent().remove();
    //etile.entity = stile.ent();
    etile.entity = entCopy.init(etile, false);
  }

  //stile.set(pistonArm, tile.getTeam(), 0);
  if(etile.ent() != null) etile.ent().updateProximity();

  if(etile.block().hasPower){
    if(etile.block() instanceof PowerNode){
      //etile.configure(etile.pos());

      var links = etile.ent().power.links.toArray();
      for(var i=0;i<links.length;i++){
        //if(!(Vars.world.tile(links[i]).block() instanceof PowerNode)) continue;
        //Vars.world.tile(links[i]).configure(stile.pos());
        //Vars.world.tile(links[i]).configure(etile.pos());
        etile.configure(links[i]);
      }

    }
    for(var i=0;i<slinks.length;i++){
      if(Vars.world.tile(slinks[i]).block() instanceof PowerNode){
        Vars.world.tile(slinks[i]).configure(etile.pos());
      }
    }
    etile.ent().power.graph.reflow(etile);
  }

  //Vars.world.notifyChanged(stile);
  Vars.world.notifyChanged(etile);
  if(pistonBlock.indexOf(etile.block().name)>-1 && etile.ent().extended() && etile.front() != null && etile.front().block().name == "air"){
    etile.getNearby(etile.rotation()).set(pistonArm, etile.getTeam(), etile.rotation());
  }
  //etile.ent().tile = etile;
  return true;
}

function recPushBlock(sr, stile){
  pushUnits(stile, sr);
  var etile = stile.getNearby(sr);
  //pushUnits(stile, tile.rotation());
  const block = stile.block();
  const r = stile.rotation();
  const team = stile.getTeam();
  if(etile == null) return -1;
  var slinks = [];
  //if(etile.block().name != "air") return 0;//push later
  if(stile.ent() != null){
    if(stile.block().hasPower){
      slinks = stile.ent().power.links.toArray();
      for(var i=0;i<slinks.length;i++){
        if(Vars.world.tile(slinks[i]).block() instanceof PowerNode){
          Vars.world.tile(slinks[i]).configure(stile.pos());
        }
      }
    }
    stile.ent().removeFromProximity();
    const entCopy = stile.ent();
    stile.entity = null;
  }
  stile.remove();

  etile.set(block, team, r);

  if(etile.ent() != null){
    etile.ent().remove();
    //etile.entity = stile.ent();
    etile.entity = entCopy.init(etile, false);
  }

  //stile.set(pistonArm, tile.getTeam(), 0);
  if(etile.ent() != null) etile.ent().updateProximity();

  if(etile.block().hasPower){
    if(etile.block() instanceof PowerNode){
      //etile.configure(etile.pos());

      var links = etile.ent().power.links.toArray();
      for(var i=0;i<links.length;i++){
        //if(!(Vars.world.tile(links[i]).block() instanceof PowerNode)) continue;
        //Vars.world.tile(links[i]).configure(stile.pos());
        //Vars.world.tile(links[i]).configure(etile.pos());
        etile.configure(links[i]);
      }

    }
    for(var i=0;i<slinks.length;i++){
      if(Vars.world.tile(slinks[i]).block() instanceof PowerNode){
        Vars.world.tile(slinks[i]).configure(etile.pos());
      }
    }
    etile.ent().power.graph.reflow(etile);
  }

  //Vars.world.notifyChanged(stile);
  Vars.world.notifyChanged(etile);
  //etile.ent().tile = etile;
  if(pistonBlock.indexOf(etile.block().name)>-1 && etile.ent().extended() && etile.front() != null && etile.front().block().name == "air"){
    etile.getNearby(etile.rotation()).set(pistonArm, etile.getTeam(), etile.rotation());
  }
  return 1;
}

const pistonArm = extendContent(Block, "pistonarm", {
  draw(tile){

  },
  /*
  onProximityUpdate(tile){
    var piston = tile.getNearby((tile.rotation()+2)%4);
    if(piston === null || piston.block() === null || piston.block().name != "commandblocks-piston") tile.remove();
  },*/
  display(tile, table){

  },
  isHidden(){
    return true;
  },
  canBreak(tile){
    return false;
  }
});


function pushBlocks(tile){
  if(tile.front() == null || !canPush(tile.front())){
    tile.ent().extendingTick(false);
    return;
  }
  if(tile.front().block().name != "air"){
    pushArray = [];
    slimeArray = [];
    var ret = addBlock(tile.rotation(), tile.front().link(), 1);
    if(ret&&pushArray.length<=999){
      for(var i=0;i<pushArray.length;i++){
        pushBlock(tile, pushArray[i]);
      }
    }
    tile.ent().power.graph.reflow(tile);
  }
  else{
    tile.getNearby(tile.rotation()).set(pistonArm, tile.getTeam(), tile.rotation());
    tile.ent().timer.reset(timerid, 0);
    pushUnits(tile, tile.rotation());
    tile.ent().setExtend(true);
    newSounds.pistonextend.at(tile.worldx(),tile.worldy(),1);
  }
  tile.ent().extendingTick(false);
}

function pullBlocks(tile){
  if(tile.front() == null){
    tile.ent().extendingTick(false);
    return;
  }
  if(tile.front().block() == pistonArm){
    tile.front().remove();
    pushArray = [];
    slimeArray = [];
    //var ret = addBlock(tile, tile.front().link(), 1);
    var pullStart = tile.front().getNearby(tile.rotation());
    const pullDir = (tile.rotation()+2)%4;
    if(pullStart == null){
      tile.ent().extendingTick(false);
      return;
    }
    if(slimeBlock.indexOf(slimeType(pullStart.link().block().name))>-1) pullStart = getLowest(pullDir, pullStart.link(), 1);
    if(pullStart == null){
      tile.ent().extendingTick(false);
      return;
    }
    pullStart = pullStart.link();
    //print("pullStart: "+pullStart);
    if(canStick(pullStart, tile) || slimeBlock.indexOf(pullStart.block().name)>-1){
      var ret = addBlock(pullDir, pullStart, 1);
      //print("pushArray: "+pushArray); print("ret: "+ret);
      if(ret&&pushArray.length<=999){
        /*
        var i=0; var j=0;
        while(j<=72 && pushArray.length>0){
          var pret = recPushBlock(pullDir, pushArray[i]);
          if(pret == -1 || pret == 1) pushArray.splice(i, 1);
          else i++;
          if(i>=pushArray.length) i=0;
          j++;
        }
        */
        for(var i=0;i<pushArray.length;i++){
          recPushBlock(pullDir, pushArray[i]);
        }
        tile.ent().power.graph.reflow(tile);
      }
    }
  }
  else{
  }
  tile.ent().extendingTick(false);
}

const pistonPushEnt = extend(BasicBulletType,{
  draw(b){},
  hit(b,x,y){},
  despawned(b){},
  update(b){},
  init(b){
    if(b == null || b.getOwner() == null || !(b.getOwner() instanceof TileEntity)) return;
    if(!(b.getOwner().getTile().block().name == "commandblocks-pistonsticky" || b.getOwner().getTile().block().name == "commandblocks-piston")) return;
    pushBlocks(b.getOwner().getTile());
    b.remove();
	}
});
pistonPushEnt.speed = 0;
pistonPushEnt.lifetime = 1;
pistonPushEnt.collidesTiles = false;
pistonPushEnt.collides = false;
pistonPushEnt.collidesAir = false;
pistonPushEnt.keepVelocity = false;

const pistonPullEnt = extend(BasicBulletType,{
  draw(b){},
  hit(b,x,y){},
  despawned(b){},
  update(b){},
  init(b){
    if(b == null || b.getOwner() == null || !(b.getOwner() instanceof TileEntity)) return;
    if(b.getOwner().getTile().block().name != "commandblocks-pistonsticky") return;
    pullBlocks(b.getOwner().getTile());
    b.remove();
	}
});
pistonPullEnt.speed = 0;
pistonPullEnt.lifetime = 1;
pistonPullEnt.collidesTiles = false;
pistonPullEnt.collides = false;
pistonPullEnt.collidesAir = false;
pistonPullEnt.keepVelocity = false;

const timerid = 0;

const newSounds = this.global.newSounds;

const piston = extendContent(Block, "piston", {
  draw(tile){
    if(tile.ent().extended()){
      this.armOffset.trns(tile.rotation()*90, Math.min(tile.ent().timer.getTime(timerid), 8));
      Draw.rect(this.topRegion, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
      if(tile.ent().timer.getTime(timerid)>4) Draw.rect(this.topRegion2, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
    }
    else{
      this.armOffset.trns(tile.rotation()*90, 8-Math.min(tile.ent().timer.getTime(timerid), 8));
      Draw.rect(this.topRegion, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
      if(tile.ent().timer.getTime(timerid)<4) Draw.rect(this.topRegion2, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
    }
    Draw.rect(this.baseRegion[tile.rotation()], tile.drawx(), tile.drawy());
  },
  load(){
    this.super$load();
    this.armOffset = Vec2(0, 0);
    this.topRegion = Core.atlas.find(this.name + "-arm");
    this.topRegion2 = Core.atlas.find(this.name + "-arm2");
    this.baseRegion = [];
    for(var i=0;i<4;i++) this.baseRegion.push(Core.atlas.find(this.name+"-"+i));
  },
  update(tile){
    if(tile.ent().timer.getTime(timerid)<8) return;
    if(tile.ent().cons.valid()){
      if(!tile.ent().extended()) this.extendBlock(tile);
    }
    else{
      if(tile.ent().extended()) this.retractBlock(tile);
    }
  },
  extendBlock(tile){
    if(tile == null && tile.getNearby(tile.rotation()) == null) return;
    tile.ent().extendingTick(true);
    Bullet.create(pistonPushEnt, tile.ent(), tile.getTeam(), tile.worldx(), tile.worldy(), tile.rotation()*90, 1, 1);
    //Core.app.post(run(()=>{
    //  this.checkAfter(tile);
    //}));
  },
  checkAfter(tile){
    if(tile.getNearby(tile.rotation()).block().name == "air"){
      tile.getNearby(tile.rotation()).set(pistonArm, tile.getTeam(), tile.rotation());
      tile.ent().timer.reset(timerid, 0);
      pushUnits(tile.getNearby(tile.rotation()),tile.rotation());
    }
    else{
      tile.ent().setExtend(false);
    }
  },
  retractBlock(tile){
    if(tile != null && tile.getNearby(tile.rotation()) != null && tile.getNearby(tile.rotation()).block() == pistonArm) tile.getNearby(tile.rotation()).remove();
    tile.ent().timer.reset(timerid, 0);
    tile.ent().setExtend(false);
    newSounds.pistoncontract.at(tile.worldx(),tile.worldy(),1);
  },
  removed(tile){
    this.super$removed(tile);
    if(tile.getNearby(tile.rotation()).block() == pistonArm) tile.getNearby(tile.rotation()).remove();
  },
  canBreak(tile){
    return /*tile.ent().timer.getTime(timerid)>8 && !tile.ent().extended() &&*/ !tile.ent().getExtendingTick();
  }
});

piston.entityType = prov(() => extend(TileEntity , {
  _extend:false,
  extended(){
    return this._extend;
  },
  setExtend(b) {
    this._extend = b;
  },
  _etick:false,
  getExtendingTick(){
    return this._etick;
  },
  extendingTick(b) {
    this._etick = b;
  },
  write(stream) {
    this.super$write(stream);
    stream.writeBoolean(this.extended());
    stream.writeBoolean(this.getExtendingTick());
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setExtend(stream.readBoolean());
    this.extendingTick(stream.readBoolean());
  }
}));

const pistonsticky = extendContent(Block, "pistonsticky", {
  draw(tile){
    if(tile.ent().extended()){
      this.armOffset.trns(tile.rotation()*90, Math.min(tile.ent().timer.getTime(timerid), 8));
      Draw.rect(this.topRegion, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
      if(tile.ent().timer.getTime(timerid)>4) Draw.rect(this.topRegion2, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
    }
    else{
      this.armOffset.trns(tile.rotation()*90, 8-Math.min(tile.ent().timer.getTime(timerid), 8));
      Draw.rect(this.topRegion, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
      if(tile.ent().timer.getTime(timerid)<4) Draw.rect(this.topRegion2, tile.drawx()+this.armOffset.x, tile.drawy()+this.armOffset.y, tile.rotation()*90);
    }
    Draw.rect(this.baseRegion[tile.rotation()], tile.drawx(), tile.drawy());
  },
  load(){
    this.super$load();
    this.armOffset = Vec2(0, 0);
    this.topRegion = Core.atlas.find(this.name + "-arm");
    this.topRegion2 = Core.atlas.find("commandblocks-piston" + "-arm2");
    this.baseRegion = [];
    for(var i=0;i<4;i++) this.baseRegion.push(Core.atlas.find("commandblocks-piston"+"-"+i));
  },
  update(tile){
    if(tile.ent().timer.getTime(timerid)<8) return;
    if(tile.ent().cons.valid()){
      if(!tile.ent().extended()) this.extendBlock(tile);
    }
    else{
      if(tile.ent().extended()) this.retractBlock(tile);
    }
  },
  extendBlock(tile){
    if(tile == null && tile.getNearby(tile.rotation()) == null) return;
    tile.ent().extendingTick(true);
    Bullet.create(pistonPushEnt, tile.ent(), tile.getTeam(), tile.worldx(), tile.worldy(), tile.rotation()*90, 1, 1);
    //Core.app.post(run(()=>{
    //  this.checkAfter(tile);
    //}));
  },
  checkAfter(tile){
    if(tile.getNearby(tile.rotation()).block().name == "air"){
      tile.getNearby(tile.rotation()).set(pistonArm, tile.getTeam(), tile.rotation());
      tile.ent().timer.reset(timerid, 0);
      pushUnits(tile.getNearby(tile.rotation()),tile.rotation());
    }
    else{
      tile.ent().setExtend(false);
    }
  },
  retractBlock(tile){
    if(tile != null && tile.getNearby(tile.rotation()) != null && tile.getNearby(tile.rotation()).block() == pistonArm){
      tile.ent().extendingTick(true);
      Bullet.create(pistonPullEnt, tile.ent(), tile.getTeam(), tile.worldx(), tile.worldy(), tile.rotation()*90, 1, 1);

    }
    tile.ent().timer.reset(timerid, 0);
    tile.ent().setExtend(false);
    newSounds.pistoncontract.at(tile.worldx(),tile.worldy(),1);
  },
  removed(tile){
    this.super$removed(tile);
    if(tile.getNearby(tile.rotation()).block() == pistonArm) tile.getNearby(tile.rotation()).remove();
  },
  canBreak(tile){
    return /*tile.ent().timer.getTime(timerid)>8 && !tile.ent().extended() &&*/ !tile.ent().getExtendingTick();
  }
});

pistonsticky.entityType = prov(() => extend(TileEntity , {
  _extend:false,
  extended(){
    return this._extend;
  },
  setExtend(b) {
    this._extend = b;
  },
  _etick:false,
  getExtendingTick(){
    return this._etick;
  },
  extendingTick(b) {
    this._etick = b;
  },
  write(stream) {
    this.super$write(stream);
    stream.writeBoolean(this.extended());
    stream.writeBoolean(this.getExtendingTick());
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setExtend(stream.readBoolean());
    this.extendingTick(stream.readBoolean());
  }
}));
