const pushInvalid = ["commandblocks-commandb", "thorium-wall", "thorium-wall-large", "commandblocks-researchskill"];
var nonSticky = ["phase-wall", "phase-wall-large"];
nonSticky = nonSticky.concat(pushInvalid);
//const pistonArm = Blocks.copperWall;
const slimeBlock = ["commandblocks-sporeblock", "commandblocks-tensorbind"];
const slimeDir = ["commandblocks-sporedir", "commandblocks-tensordir"];
nonSticky = nonSticky.concat(slimeBlock);
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

function canPush(ptile){
  return (pushInvalid.indexOf(ptile.block().name) < 0)&&ptile.breakable();
}

function canStick(ptile, origTile){
  var orig = origTile.block().name;
  var slimet = slimeType(ptile.block().name);
  return ((nonSticky.indexOf(ptile.block().name) < 0)&&ptile.breakable()&&(slimet == orig || slimet == ptile.block().name || ptile.front().link() != origTile)) || ptile.block().name == orig;
}

function slimeType(name){
  if(name == "commandblocks-sporedir") return "commandblocks-sporeblock";
  if(name == "commandblocks-tensordir") return "commandblocks-tensorbind";
  return name;
}

function getLowest(tile, stile, count){
  var ret = stile;
  for(var i=0;i<12-count;i++){
    var etile = stile.getNearby((tile.rotation()+2)%4);
    if(etile == null || etile.block().name == "air" || pushArray.indexOf(etile) > -1 || !canStick(etile, stile)) return stile;
    if(slimeBlock.indexOf(etile.block().name) > -1 || (slimeDir.indexOf(etile.block().name) > -1 && (etile.rotation()-tile.rotation()+4)%4 == 2)) stile = etile;//for 2x2 slimes add .link()
    else return etile.link();
  }
}

function addSide(tile, stile, count, orig){
  if(stile == null || count > 12) return false;
  if(stile.link() == null) return false;
  stile = stile.link();
  if(stile.block().name == "air" || pushArray.indexOf(stile) > -1 || slimeArray.indexOf(stile) > -1 ||  !canPush(stile) || !canStick(stile, orig)) return true;
  return addBlock(tile, getLowest(tile, stile, count), ++count);
}

function addBlock(tile, stile, count){
  if(stile == null) return false;
  var pusharr = getFrontBlocks(stile, tile.rotation());
  if(slimeBlock.indexOf(stile.block().name) > -1){
    slimeArray.push(stile);
    var retSide = addSide(tile, stile.getNearby((tile.rotation()+1)%4), count, stile);
    if(!retSide) return false;
    retSide = addSide(tile, stile.getNearby((tile.rotation()+3)%4), count, stile);
    if(!retSide) return false;
  }
  else if(slimeDir.indexOf(stile.block().name) > -1&&(stile.rotation()-tile.rotation()+2)%2==1){
    slimeArray.push(stile);
    var retSide = addSide(tile, stile.getNearby(stile.rotation()), count, stile);
    if(!retSide) return false;
  }
  if(count + pusharr.length>12) return false;
  if(count<12){
    for(var i=0;i<pusharr.length;i++){
      if(pusharr[i] == null || !canPush(pusharr[i])) return false;
      var ret = addBlock(tile, pusharr[i], ++count);
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
  if(count + pusharr.length>12) return false;
  if(count<12){
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
  if(etile == null) return;
  if(stile.ent() != null){
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
    etile.ent().power.graph.reflow(etile);
  }

  //Vars.world.notifyChanged(stile);
  Vars.world.notifyChanged(etile);
  //etile.ent().tile = etile;
  return true;
}

const pistonArm = extendContent(Block, "pistonarm", {
  draw(tile){
    //
  },
  onProximityUpdate(tile){
    var piston = tile.getNearby((tile.rotation()+2)%4);
    if(piston === null || piston.block() === null || piston.block().name != "commandblocks-piston") tile.remove();
  },
  display(tile, table){

  },
  isHidden(){
    return true;
  },
  canBreak(){
    return false;
  }
});


function pushBlocks(tile){
  if(tile.front() == null || tile.front().block().name == "air" || !canPush(tile.front())) return;
  pushArray = [];
  slimeArray = [];
  var ret = addBlock(tile, tile.front().link(), 1);
  if(ret&&pushArray.length<=12){
    for(var i=0;i<pushArray.length;i++){
      pushBlock(tile, pushArray[i]);
    }

  }
  if(tile.getNearby(tile.rotation()).block().name == "air") tile.getNearby(tile.rotation()).set(pistonArm, tile.getTeam(), tile.rotation());
}


const pustonPushEnt = extend(BasicBulletType,{
  draw(b){},
  hit(b,x,y){},
  despawned(b){},
  update(b){},
  init(b){
    if(b === null || b.getOwner() === null || !(b.getOwner() instanceof TileEntity)) return;
    pushBlocks(b.getOwner().getTile());
    b.remove();
	}
});
pustonPushEnt.speed = 0;
pustonPushEnt.lifetime = 1;
pustonPushEnt.collidesTiles = false;
pustonPushEnt.collides = false;
pustonPushEnt.collidesAir = false;
pustonPushEnt.keepVelocity = false;

const timerid = 0;

const piston = extendContent(Block, "piston", {
  draw(tile){
    if(tile.ent().extended()){
      this.offset.trns(tile.rotation()*90, Mathf.min(tile.ent().timer.getTime(timerid), 8));
      Draw.rect(this.topRegion, tile.drawx()+this.offset.x, tile.drawy()+this.offset.y, tile.rotation()*90);
    }
    else Draw.rect(this.topRegion, tile.drawx(), tile.drawy(), tile.rotation()*90);
    Draw.rect(this.baseRegion[tile.rotation()], tile.drawx(), tile.drawy());
  },
  load(){
    this.super$load();
    this.offset = Vec2(0, 0);
    this.topRegion = Core.atlas.find(this.name + "-arm");
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
    Bullet.create(pistonPushEnt, tile.ent(), tile.getTeam(), tile.worldx(), tile.worldy(), tile.rotation()*90, 1, 1);
    tile.ent().timer.reset(timerid, 0);
    tile.ent().setExtend(true);
  },
  retractBlock(tile){
    if(tile.getNearby(tile.rotation()).block() == pistonarm) tile.getNearby(tile.rotation()).remove();
    tile.ent().setExtend(false);
  },
  removed(tile){
    this.super$removed(tile);
    if(tile.getNearby(tile.rotation()).block() == pistonarm) tile.getNearby(tile.rotation()).remove();
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
  write(stream) {
    this.super$write(stream);
    stream.writeBoolean(this.extended());
  },
  read(stream, revision) {
    this.super$read(stream, revision);
    this.setExtend(stream.readBoolean());
  }
}));
