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
  scalar: Color.valueOf("f5bbf1"),
  vector: Color.valueOf("7f9cfa"),
  zeta: Color.valueOf("82ffe8"),
  code: Color.valueOf("5eff79")
};

const scalarFx = newEffect(15, e => {
  Angles.randLenVectors(e.id, 6, 4 + e.fin() * 5, floatc2((x,y) => {
    Draw.color(Color.white, colors.scalar, e.fout());
    Fill.circle(e.x + x, e.y + y, 0.5 + e.fout() * 2);
  }));
});

const vectorFx = newEffect(15, e => {
  Angles.randLenVectors(e.id, 6, 4 + e.fin() * 5, floatc2((x,y) => {
    Draw.color(Color.white, colors.vector, e.fout());
    Fill.square(e.x + x, e.y + y, 0.5 + e.fout() * 2, 45);
  }));
});

const zetaFx = newEffect(20, e => {
  Draw.color(Color.white, colors.zeta, e.finpow());
  drawSpark(e.x, e.y, e.fout()*1.4, e.finpow()*12, 0);
  Lines.stroke(e.fout());
  Lines.circle(e.x, e.y, e.finpow()*4);
});

const scalarcooker = extendContent(GenericSmelter, "scalarcooker", {
});
scalarcooker.updateEffect = scalarFx;

const vectorkiln = extendContent(GenericSmelter, "vectorkiln", {
});
scalarcooker.updateEffect = vectorFx;

const zetarefiner = extendContent(GenericCrafter, "zetarefiner", {
});
scalarcooker.updateEffect = zetaFx;
