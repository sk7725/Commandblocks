if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}

const colors = {
  scalar: Color.valueOf("f5ddf3"),
  vector: Color.valueOf("cfddff"),
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

function drawSpark(x, y, size, width, r){
  Drawf.tri(x, y, width, size, r);
  Drawf.tri(x, y, width, size, r+180);
  Drawf.tri(x, y, width, size, r+90);
  Drawf.tri(x, y, width, size, r+270);
}



const scalarFx = newEffect(45, e => {
  Draw.color(colors.scalar);
  var i=1;
  Angles.randLenVectors(e.id, e.id%3+1, 8, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*2.5, 0.5+e.fout(), e.id*i);
    i++;
  }));
});
const vectorFx = newEffect(45, e => {
  Draw.color(colors.vector);
  var i=1;
  Angles.randLenVectors(e.id, e.id%3+1, 8, floatc2((x,y) => {
    drawSpark(e.x+x, e.y+y, e.fout()*2.5, 0.5+e.fout(), e.id*i);
    i++;
  }));
});
const zetaFx = newEffect(50, e => {
  Draw.color(colors.zeta);
  Lines.stroke(e.fout());
  Angles.randLenVectors(e.id, 4, 7+5*e.fin(), floatc2((x,y) => {
    Lines.poly(e.x+x, e.y+y, 4, e.fin()*0.6+0.45);
  }));
});
const codeFx = newEffect(50, e => {
  Draw.color(colors.code);
  var i=e.id;
  Angles.randLenVectors(e.id, 5, 7+5*e.fin(), floatc2((x,y) => {
    i++;
    drawBit(i%2, e.x+x, e.y+y, 1, e.fout());
  }));
});

/*
const deposcalar = extendContent(OreBlock, "depo-scalar", {
});
//deposcalar.updateEffect = scalarFx;
//deposcalar.walkEffect = scalarFx;
const depovector = extendContent(OreBlock, "depo-vector", {
});
//depovector.updateEffect = vectorFx;
//depovector.walkEffect = vectorFx;
const depozeta = extendContent(OreBlock, "depo-zeta", {
});
//depozeta.updateEffect = zetaFx;
//depozeta.walkEffect = zetaFx;
const depocode = extendContent(OreBlock, "depo-code", {
});
//depocode.updateEffect = codeFx;
//depocode.walkEffect = codeFx;
*/
const sparkling = ["commandblocks-depo-scalar", "commandblocks-depo-vector", "commandblocks-depo-zeta", "commandblocks-depo-code"];
const sparkleFx = [scalarFx, vectorFx, zetaFx, codeFx];
const thresh = (Vars.mobile)?3:4;

var v1 = new Vec2(0,0); var tile = null;
Events.on(EventType.Trigger.update, run(function(){
  if(Vars.state.is(GameState.State.playing)){
    for(var i=0;i<thresh;i++){
      v1 = Core.camera.unproject(Mathf.random()*Core.graphics.getWidth(), Mathf.random()*Core.graphics.getHeight());
      tile = Vars.world.tileWorld(v1.x, v1.y);
      if(tile!=null && sparkling.indexOf(tile.overlay().name)>-1) Effects.effect(sparkleFx[sparkling.indexOf(tile.overlay().name)], tile.worldx(), tile.worldy());
    }
  }
}));
