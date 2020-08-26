//const modName = "commandblocks-";
const slimeBlocks = ["commandblocks-sporeblock", "commandblocks-tensorbind", "commandblocks-sporedir", "commandblocks-tensordir", "commandblocks-surgejoint"];
const sporeblock = extendContent(Block, "sporeblock",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  }
});

const sporedir = extendContent(Block, "sporedir",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  },
  load(){
    this.super$load();
    this.dirRegion = [];
    this.dirRegion.push(Core.atlas.find(this.name));
    for(var i=1;i<4;i++) this.dirRegion.push(Core.atlas.find(this.name+"-"+i));
  },
  draw(tile){
    Draw.rect(this.dirRegion[tile.rotation()], tile.drawx(), tile.drawy());
  }
});

const tensorbind = extendContent(Block, "tensorbind",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  }
});

const tensordir = extendContent(Block, "tensordir",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  },
  load(){
    this.super$load();
    this.dirRegion = [];
    this.dirRegion.push(Core.atlas.find(this.name));
    for(var i=1;i<4;i++) this.dirRegion.push(Core.atlas.find(this.name+"-"+i));
  },
  draw(tile){
    Draw.rect(this.dirRegion[tile.rotation()], tile.drawx(), tile.drawy());
  }
});

const surgejoint = extendContent(Block, "surgejoint",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  }
});
