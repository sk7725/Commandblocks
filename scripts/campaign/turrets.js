//이런 영감 아저씨
if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}

const undyneShoot = newEffect(25, e => {
Draw.color(Pal.lancerLaser, Color.white, e.fout());
  Lines.stroke(e.fout());
  var v1 = Vec2(e.fin()*4,0).setAngle(e.rotation+180);
  Lines.circle(e.x+v1.x, e.y+v1.y, e.fin()*25);
  Lines.stroke(e.fout()*1.5);
  Draw.color(Color.white);
  Angles.randLenVectors(e.id, 6, 20*e.finpow(), e.rotation, 50, floatc2((x,y) => {
    Lines.lineAngle(e.x+x, e.y+y, Mathf.angle(x, y), 1+e.fout()*4);
  }));
});
const undyne = extendContent(PowerTurret, "undyne", {});

undyne.shootEffect = undyneShoot;
undyne.shootType = this.global.bullets.spear;
