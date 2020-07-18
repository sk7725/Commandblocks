const modName = "commandblocks-";
const slimeBlocks = [modName+"sporeblock", modName+"tensorbind", modName+"sporedir", modName+"tensordir"];
const sporeblock = extendContent(Block, "sporeblock",{
  canReplace(other){
    return slimeBlocks.indexOf(other.name) > -1;
  }
});

const tensorbind = extendContent(Block, "tensorbind",{
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
