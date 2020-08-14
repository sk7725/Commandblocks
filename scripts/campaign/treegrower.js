if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}
function drawSpark(x, y, size, width, r){
  Drawf.tri(x, y, width, size, r);
  Drawf.tri(x, y, width, size, r+180);
  Drawf.tri(x, y, width, size, r+90);
  Drawf.tri(x, y, width, size, r+270);
}

const colors = {
  spore: Color.valueOf("7457ce"),
  spore2: Color.valueOf("5e4e91"),
  leaf: Color.valueOf("84f491"),
  leaf2: Color.valueOf("62ae7f")
};

const tree = {
  "spore-pod": {
    sapling: "spore-cluster",
    tree: "white-tree",
    harvest: newEffect(90, e => {
      Draw.color(colors.spore, colors.spore2, e.finpow());
      var i=0;
      Angles.randLenVectors(e.id, 13, 40 + e.finpow()*4, floatc2((x,y) => {
        i++;
        Draw.alpha(e.fout()*Mathf.randomSeed(e.id+i)*8);
        Fill.circle(e.x + x, e.y + y, 2);
      }));
    }),
    grow: newEffect(90, e => {
      Draw.color(Color.white, colors.spore, e.fin());
      Angles.randLenVectors(e.id, 13, 20 + e.fin()*20, floatc2((x,y) => {
        drawSpark(e.x+x, e.y+y, e.fout()*3, 8, 0);
      }));
    })
  },
  "log-binary": {
    sapling: "commandblocks-sapling",
    tree: "commandblocks-binary-tree",
    harvest: newEffect(90, e => {
      Draw.color(colors.leaf, colors.leaf2, e.finpow());
      var i=0;
      Angles.randLenVectors(e.id, 13, 40 + e.finpow()*4, floatc2((x,y) => {
        i++;
        Draw.alpha(e.fout()*Mathf.randomSeed(e.id+i)*8);
        Fill.circle(e.x + x, e.y + y, 2);
      }));
    }),
    grow: newEffect(90, e => {
      Draw.color(Color.white, Pal.heal, e.fin());
      Angles.randLenVectors(e.id, 13, 20 + e.fin()*20, floatc2((x,y) => {
        drawSpark(e.x+x, e.y+y, e.fout()*3, 8, 0);
      }));
    })
  },
  "log-redblack": {
    sapling: "commandblocks-rbsapling",
    tree: "commandblocks-rb-tree"
  }
}

const sporegrower = extendContent(GenericCrafter, "sporegrower", {
  load(){
    this.super$load();
    this.rimRegion = Core.atlas.find(this.name + "-rim");
  },
  draw(tile){
    Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
    if(!tile.ent().ready()){
      var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
      var type = Mathf.randomSeed(tile.pos()+1, 1, 3);
      Draw.rect(tree[this.outputItem.item.name].sapling+type, tile.drawx(), tile.drawy(), rot);
    }
  },
  update(tile){
    if(tile.ent().ready()) return;//wait for harvesting
    else{
      if(!Vars.net.client()){
        if(tile.ent().getGrowth() >= this.craftTime){
          tile.configure(1);
          tile.ent().finishGrow();//just in case
        }
        else{
          if(tile.ent().cons.valid() && Mathf.chance(0.9)) tile.ent().addGrowth(1);
          //TODO add affinities
        }
      }
    }

    if(tile.ent().timer.get(this.timerDump, this.dumpTime)){
      this.tryDump(tile, this.outputItem.item);
    }
  },
  configured(tile, player, value){
    if(value == 1){
      Effects.effect(tree[this.outputItem.item.name].grow, tile.drawx(), tile.drawy());
      tile.ent().finishGrow();
    }
  },
  tapped(tile, player){
    if(!tile.ent().ready()) return;
    tile.ent().setReady(false);
    this.useContent(tile, this.outputItem.item);
    for(var i=0; i<this.outputItem.amount; i++) this.offloadNear(tile, this.outputItem.item);
    Effects.effect(tree[this.outputItem.item.name].harvest, tile.drawx(), tile.drawy());
  },
  drawLayer(tile){
    var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
    if(tile.ent().ready()){
      Draw.rect(tree[this.outputItem.item.name].tree, tile.drawx(), tile.drawy(), rot);
    }
  }
});

sporegrower.entityType=prov(() => extend(TileEntity, {
  _ready:false,
  _growth:0,
  ready(){
    return this._ready;
  },
  finishGrow(){
    this._ready = true;
    this._growth = 0;
  },
  setReady(a){
    this._ready = a;
  },
  getGrowth(){
    return this._growth;
  },
  addGrowth(a){
    this._growth += a;
  },
  setGrowth(a){
    this._growth = a;
  },
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._ready);
    stream.writeShort(this._growth);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._ready = stream.readBoolean();
    this._growth = stream.readShort();
  }
}));

//TREEGROWER
const treegrower = extendContent(GenericCrafter, "treegrower", {
  load(){
    this.super$load();
    this.rimRegion = Core.atlas.find(this.name + "-rim");
  },
  draw(tile){
    Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
    if(!tile.ent().ready()){
      var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
      var type = Mathf.randomSeed(tile.pos()+1, 1, 3);
      Draw.rect(tree[this.outputItem.item.name].sapling+type, tile.drawx(), tile.drawy(), rot);
    }
  },
  update(tile){
    if(tile.ent().ready()) return;//wait for harvesting
    else{
      if(!Vars.net.client()){
        if(tile.ent().getGrowth() >= this.craftTime){
          tile.configure(1);
          tile.ent().finishGrow();//just in case
        }
        else{
          if(tile.ent().cons.valid() && Mathf.chance(0.9)) tile.ent().addGrowth(1);
          //TODO add affinities
        }
      }
    }

    if(tile.ent().timer.get(this.timerDump, this.dumpTime)){
      this.tryDump(tile, this.outputItem.item);
    }
  },
  configured(tile, player, value){
    if(value == 1){
      Effects.effect(tree[this.outputItem.item.name].grow, tile.drawx(), tile.drawy());
      tile.ent().finishGrow();
    }
  },
  tapped(tile, player){
    if(!tile.ent().ready()) return;
    tile.ent().setReady(false);
    this.useContent(tile, this.outputItem.item);
    for(var i=0; i<this.outputItem.amount; i++) this.offloadNear(tile, this.outputItem.item);
    Effects.effect(tree[this.outputItem.item.name].harvest, tile.drawx(), tile.drawy());
  },
  drawLayer(tile){
    var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
    if(tile.ent().ready()){
      Draw.rect(tree[this.outputItem.item.name].tree, tile.drawx(), tile.drawy(), rot);
    }
  }
});

treegrower.entityType=prov(() => extend(TileEntity, {
  _ready:false,
  _growth:0,
  ready(){
    return this._ready;
  },
  finishGrow(){
    this._ready = true;
    this._growth = 0;
  },
  setReady(a){
    this._ready = a;
  },
  getGrowth(){
    return this._growth;
  },
  addGrowth(a){
    this._growth += a;
  },
  setGrowth(a){
    this._growth = a;
  },
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._ready);
    stream.writeShort(this._growth);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._ready = stream.readBoolean();
    this._growth = stream.readShort();
  }
}));

//RBGROWER
const rbgrower = extendContent(GenericCrafter, "rbgrower", {
  load(){
    this.super$load();
    this.rimRegion = Core.atlas.find(this.name + "-rim");
  },
  draw(tile){
    Draw.rect(this.rimRegion, tile.drawx(), tile.drawy());
    if(!tile.ent().ready()){
      var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
      var type = Mathf.randomSeed(tile.pos()+1, 1, 3);
      Draw.rect(tree[this.outputItem.item.name].sapling+type, tile.drawx(), tile.drawy(), rot);
    }
  },
  update(tile){
    if(tile.ent().ready()) return;//wait for harvesting
    else{
      if(!Vars.net.client()){
        if(tile.ent().getGrowth() >= this.craftTime){
          tile.configure(1);
          tile.ent().finishGrow();//just in case
        }
        else{
          if(tile.ent().cons.valid() && Mathf.chance(0.9)) tile.ent().addGrowth(1);
          //TODO add affinities
        }
      }
    }

    if(tile.ent().timer.get(this.timerDump, this.dumpTime)){
      this.tryDump(tile, this.outputItem.item);
    }
  },
  configured(tile, player, value){
    if(value == 1){
      Effects.effect(tree[this.outputItem.item.name].grow, tile.drawx(), tile.drawy());
      tile.ent().finishGrow();
    }
  },
  tapped(tile, player){
    if(!tile.ent().ready()) return;
    tile.ent().setReady(false);
    this.useContent(tile, this.outputItem.item);
    for(var i=0; i<this.outputItem.amount; i++) this.offloadNear(tile, this.outputItem.item);
    Effects.effect(tree[this.outputItem.item.name].harvest, tile.drawx(), tile.drawy());
  },
  drawLayer(tile){
    var rot = Mathf.randomSeed(tile.pos(), 0, 3)*90;
    if(tile.ent().ready()){
      Draw.rect(tree[this.outputItem.item.name].tree, tile.drawx(), tile.drawy(), rot);
    }
  }
});


rbgrower.entityType=prov(() => extend(TileEntity, {
  _ready:false,
  _growth:0,
  ready(){
    return this._ready;
  },
  finishGrow(){
    this._ready = true;
    this._growth = 0;
  },
  setReady(a){
    this._ready = a;
  },
  getGrowth(){
    return this._growth;
  },
  addGrowth(a){
    this._growth += a;
  },
  setGrowth(a){
    this._growth = a;
  },
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._ready);
    stream.writeShort(this._growth);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._ready = stream.readBoolean();
    this._growth = stream.readShort();
  }
}));
