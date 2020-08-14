if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}
function drawSpark(x, y, size, width, r){
  Drawf.tri(x, y, width, size, r);
  Drawf.tri(x, y, width, size, r+180);
  Drawf.tri(x, y, width, size, r+90);
  Drawf.tri(x, y, width, size, r+270);
}
function drawBit(bit, x, y, size, stroke){
  if(bit){
    Lines.stroke(stroke*1.2);
    Lines.lineAngleCenter(x, y, 90, size);
  }
  else{
    Lines.stroke(stroke);
    Lines.poly(x, y, 4, size, 45);
  }
}

const colors = {
  scalar: Color.valueOf("f5bbf1"),
  vector: Color.valueOf("7f9cfa"),
  zeta: Color.valueOf("82ffe8"),
  code: Color.valueOf("5eff79")
};

const scalarFx = newEffect(15, e => {
  Draw.color(Color.white, colors.scalar, e.fout());
  Angles.randLenVectors(e.id, 6, 4 + e.fin() * 5, floatc2((x,y) => {
    Fill.circle(e.x + x, e.y + y, 0.5 + e.fout() * 2);
  }));
});

const vectorFx = newEffect(15, e => {
  Draw.color(Color.white, colors.vector, e.fout());
  Angles.randLenVectors(e.id, 6, 4 + e.fin() * 5, floatc2((x,y) => {
    Fill.square(e.x + x, e.y + y, 0.5 + e.fout() * 2, 45);
  }));
});

const zetaFx = newEffect(20, e => {
  Draw.color(Color.white, colors.zeta, e.finpow());
  drawSpark(e.x, e.y, e.fout()*1.6, e.finpow()*15, 0);
  Lines.stroke(e.fout());
  Lines.circle(e.x, e.y, e.finpow()*4.4);
});

const codeFx = newEffect(15, e => {
  //Draw.color(Pal.accent);
  //var i=e.id;
  Draw.color(Color.white, colors.code, e.fout());
  /*Angles.randLenVectors(e.id, 3, 7+5*e.fin(), floatc2((x,y) => {
    i++;
    drawBit(i%2, e.x+x, e.y+y, 1, e.fout());
  }));*/
  Angles.randLenVectors(e.id, 3, 4 + e.fin() * 7, floatc2((x,y) => {
    Fill.circle(e.x + x, e.y + y, 0.5 + e.fout() * 2);
  }));
  Angles.randLenVectors(e.id+1, 3, 4 + e.fin() * 7, floatc2((x,y) => {
    Fill.square(e.x + x, e.y + y, 0.5 + e.fout() * 2, 45);
  }));
});

const scalarcooker = extendContent(GenericSmelter, "scalarcooker", {
});
scalarcooker.updateEffect = scalarFx;

const vectorkiln = extendContent(GenericSmelter, "vectorkiln", {
});
vectorkiln.updateEffect = vectorFx;

const zetarefiner = extendContent(GenericCrafter, "zetarefiner", {
});
zetarefiner.updateEffect = zetaFx;

const codecrafter = extendContent(GenericSmelter, "codecrafter", {
  //credits to thepythonguy
  draw(tile){
    entity = tile.ent();
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Shaders.build.region = this.region;
    Shaders.build.progress = entity.progress;
    Shaders.build.color.set(Pal.accent);
    Shaders.build.color.a = entity.progress;
    Shaders.build.time = -entity.progress*15;
    Draw.shader(Shaders.build);
    Draw.rect(this.outputItem.item.icon(Cicon.medium), tile.drawx(), tile.drawy());
    Draw.shader();
    Draw.color(Pal.accent);
    Draw.alpha(entity.progress>0.0001?1:0);
    Lines.lineAngleCenter(tile.drawx() + Mathf.sin(entity.progress*12.564, 1, Vars.tilesize / 2 * this.size - 2)/2,tile.drawy(), 90, this.size * Vars.tilesize - Vars.tilesize * 1.6);
    Draw.reset();
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    //Draw.rect(this.region, tile.drawx(), tile.drawy())
    /*
    if(entity.warmup > 0){
      g = 0.3;
            r = 0.06;
            cr = Mathf.random(0.1);

            Draw.alpha(((1 - g) + Mathf.absin(Time.time(), 8, g) + Mathf.random(r) - r) * entity.warmup);


            Draw.color(1, 1, 1, entity.warmup);
            Draw.rect(this.topRegion, tile.drawx(), tile.drawy());

            Draw.color();
    }
    */
	}
});
codecrafter.updateEffect = codeFx;

const grinder = extendContent(GenericCrafter, "grinder", {
  draw(tile){
    Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
    Draw.rect(this.spinnerRegion, tile.drawx(), tile.drawy(), tile.ent().getRot());
    Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
    print(tile.ent().warmup);
  },
  load(){
    this.super$load();
    this.baseRegion = Core.atlas.find(this.name + "-base");
    this.spinnerRegion = Core.atlas.find(this.name + "-rotator");
    this.topRegion = Core.atlas.find(this.name + "-top");
  },
  updare(tile){
    this.super$update(tile);
    tile.ent().addRot(10);
  }
});
grinder.entityType = prov(() => extend(GenericCrafter.GenericCrafterEntity, {
  _rot: 0,
  getRot(){
    return this._rot;
  },
  addRot(a){
    this._rot += a;
  }
}));

const disassembler = extendContent(Separator, "disassembler", {
  //credits to younggam
  update(tile){
    if(tile.entity.timer.get(this.timerDump,this.dumpTime)){
      for(var l=0;l<this.results.length;l++){
        if(tile.entity.items.has(this.results[l].item)){
          this.tryDump(tile,this.results[l].item);
        }
      }
    }
    this.super$update(tile);
  },
  shouldConsume(tile){
    for(var i=0;i<this.results.length;i++){
      if(this.results[i]!=null&&tile.entity.items.get(this.results[i].item)>=this.itemCapacity){
        return false;
      }
    }
    return true;
  }
});

const cmachine = extendContent(Fracker, "cmachine", {
});
