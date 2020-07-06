const colors = {
  scalar: Color.valueOf("f5bbf1"),
  vactor: Color.valueOf("7f9cfa"),
  zeta: Color.valueOf("82ffe8"),
  code: Color.valueOf("5eff79")
};

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

const scalarFx = newEffect(25, e => {
  Draw.color(colors.scalar);
  Angles.randLenVectors(e.id, 1, 7+5*e.fin(), floatc2((x,y) => {
    Fill.circle(e.x+x, e.y+y, e.fout()*0.9);
  }));
});
const vectorFx = newEffect(25, e => {
  Draw.color(colors.vector);
  Angles.randLenVectors(e.id, 1, 7+5*e.fin(), floatc2((x,y) => {
    Drawf.tri(e.x+x, e.y+y, e.fout()*2.7, e.fout()*2.7, e.x%5*36*e.fin());
  }));
});
const zetaFx = newEffect(25, e => {
  Draw.color(colors.zeta);
  Lines.stroke(e.fout());
  Angles.randLenVectors(e.id, 1, 7+5*e.fin(), floatc2((x,y) => {
    Lines.poly(e.x+x, e.y+y, 4, e.fin()*0.6+0.3);
  }));
});
const codeFx = newEffect(25, e => {
  Draw.color(colors.code);
  Angles.randLenVectors(e.id, 1, 7+5*e.fin(), floatc2((x,y) => {
    drawBit(e.id%2, e.x+x, e.y+y, 1, e.fout());
  }));
});

const deposcalar = extendContent(OreBlock, "depo-scalar", {
  draw(tile){
    if(!Vars.state.isPaused()) Effects.effect(scalarFx, tile.worldx(), tile.worldy());
    this.super$draw(tile);
  }
});
//deposcalar.updateEffect = scalarFx;
//deposcalar.walkEffect = scalarFx;
const depovector = extendContent(OreBlock, "depo-vector", {
  draw(tile){
    if(!Vars.state.isPaused()&&Mathf.chance(0.1)) Effects.effect(vectorFx, tile.worldx(), tile.worldy());
    this.super$draw(tile);
  }
});
//depovector.updateEffect = vectorFx;
//depovector.walkEffect = vectorFx;
const depozeta = extendContent(OreBlock, "depo-zeta", {
  draw(tile){
    if(!Vars.state.isPaused()&&Mathf.chance(0.1)) Effects.effect(zetaFx, tile.worldx(), tile.worldy());
    this.super$draw(tile);
  }
});
//depozeta.updateEffect = zetaFx;
//depozeta.walkEffect = zetaFx;
const depocode = extendContent(OreBlock, "depo-code", {
  draw(tile){
    if(!Vars.state.isPaused()&&Mathf.chance(0.1)) Effects.effect(codeFx, tile.worldx(), tile.worldy());
    this.super$draw(tile);
  }
});
//depocode.updateEffect = codeFx;
//depocode.walkEffect = codeFx;
