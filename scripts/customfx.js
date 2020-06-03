var shieldColor = Color.valueOf("ffd37f").a(0.7);
const shieldInColor = Color.black.cpy().a(0);
this.global.fx = {
  slash : newEffect(90, e => {
    Draw.color(Pal.lancerLaser);
    Drawf.tri(e.x, e.y, 4 * e.fout(), 45, (e.id*57 + 90)%360);
  	Drawf.tri(e.x, e.y, 4 * e.fout(), 45, (e.id*57 - 90)%360);
  }),
  sword : newEffect(7, e => {
    Draw.color(Pal.lancerLaser);
    var sign=(e.id%2==0)?1:-1;
    var width=4;
    var r1=sign*(45-20*e.fin());
    var v1=Vec2(14,0).setAngle(e.rotation+r1);
    Drawf.tri(e.x+v1.x, e.y+v1.y, width, 14.2*e.fin(), (e.rotation+sign*90+r1)%360);
    r1=sign*(45-45*e.fin());
    v1=Vec2(13,0).setAngle(e.rotation+r1);
    Lines.stroke(width*0.75);
    Lines.lineAngleCenter(e.x+v1.x, e.y+v1.y, (e.rotation+90+r1)%360, 10*e.fin());
    r1=sign*(45-70*e.fin());
    v1=Vec2(14,0).setAngle(e.rotation+r1);
    Drawf.tri(e.x+v1.x, e.y+v1.y, width, 14.2*e.fin(), (e.rotation-sign*90+r1)%360);
  }),
  unitShieldBreak : newEffect(35, e => {
    var radius = 10;
    if(e.data != null){
      var unit = e.data.getType();
      radius = unit.hitsize * 1.3;
    }

    e.scaled(16, cons(c => {
      Draw.color(shieldColor);
      Lines.stroke(c.fout() * 2 + 0.1);

      Angles.randLenVectors(e.id, Mathf.floorPositive(radius * 1.2), e.rotation, radius/2 + c.finpow() * radius*1.25, floatc2((x, y) => {
        Lines.lineAngle(c.x + x, c.y + y, Mathf.angle(x, y), c.fout() * 5 + 1);
      }));
    }));

    Draw.color(shieldColor, e.fout());
    Draw.stroke(1 * e.fout());
    Lines.circle(e.x, e.y, radius);
  }),
  unitShieldHit : newEffect(30, e => {
    var radius = 10;
    if(e.data != null){
      var unit = e.data.getType();
      radius = unit.hitsize * 1.3;
    }

    Fill.light(e.x, e.y, Lines.circleVertices(radius), radius, shieldInColor, shieldColor.a(e.fout()*0.7));
  })
};
