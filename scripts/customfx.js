var shieldColor = Color.valueOf("ffd37f").a(0.7);
const shieldInColor = Color.black.cpy().a(0);
const spaceshader = this.global.shaders.space;
//이런 영감 아저씨
if (typeof(floatc2)== "undefined"){
  const floatc2 = method => new Floatc2(){get : method};
}
//Great.
function fillLight(x, y, sides, radius, center, edge){
  var centerf = center.toFloatBits(); var edgef = edge.toFloatBits();
  sides = Mathf.ceil(sides / 2) * 2;
  var space = 360 / sides;

  for(var i = 0; i < sides; i += 2){
    var px = Angles.trnsx(space * i, radius);
    var py = Angles.trnsy(space * i, radius);
    var px2 = Angles.trnsx(space * (i + 1), radius);
    var py2 = Angles.trnsy(space * (i + 1), radius);
    var px3 = Angles.trnsx(space * (i + 2), radius);
    var py3 = Angles.trnsy(space * (i + 2), radius);
    Fill.quad(x, y, centerf, x + px, y + py, edgef, x + px2, y + py2, edgef, x + px3, y + py3, edgef);
  }
}

function newGroundEffect(lifetime, staticLife, renderer){
  return new GroundEffectEntity.GroundEffect(lifetime, staticLife, new Effects.EffectRenderer({render: renderer}));
}

this.global.fx = {
  draw : newGroundEffect(0, 1, e => {
    if(e.data == null) return;
    try{
      Draw.color(e.color);
      Draw.rect(e.data, e.x, e.y, e.rotation);
    }
    catch(err){
      print(err);
    }
  }),
  drawWH : newGroundEffect(0, 1, e => {
    if(e.data == null) return;
    try{
      Draw.color(e.color);
      Draw.rect(e.data.texture, e.x, e.y, e.data.w, e.data.h, e.rotation);
    }
    catch(err){
      print(err);
    }
  }),
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
    try{
      var radius = 10;
      if(e.data != null){
        radius = e.data * 1.3;
      }

      e.scaled(16, cons(c => {
        Draw.color(Pal.accent);
        Lines.stroke(c.fout() * 2 + 0.1);

        Angles.randLenVectors(e.id, Mathf.floorPositive(radius * 1.2), radius/2 + c.finpow() * radius*1.25, floatc2((x, y) => {
          Lines.lineAngle(c.x + x, c.y + y, Mathf.angle(x, y), c.fout() * 5 + 1);
        }));
      }));

      Draw.color(Pal.accent, e.fout());
      Lines.stroke(1 * e.fout());
      Lines.circle(e.x, e.y, radius);
    }
    catch(err){
      print(err);
    }
  }),
  unitShieldHit : newEffect(30, e => {
    try{
      var radius = 10;
      if(e.data != null){
        radius = e.data * 1.3;
      }

      fillLight(e.x, e.y, Lines.circleVertices(radius), radius, shieldInColor, shieldColor.lerp(Color.white.cpy().a(0.6), e.fout() / 2).a(e.fout()*0.6));
    }
    catch(err){
      print(err);
    }
  }),
  unitShieldEnd : newEffect(35, e => {
    try{
      var radius = 10;
      if(e.data != null){
        radius = e.data * 1.3;
      }

      Draw.color(shieldColor, e.fout());
      Lines.stroke(1.5 * e.fout());
      Lines.circle(e.x, e.y, radius);
    }
    catch(err){
      print(err);
    }
  }),
  healFx : newEffect(25, e => {
    Draw.color(Pal.surge, Pal.heal.cpy().a(0), e.fin());
    Lines.stroke(1);
    var offset = e.fin()*5;
    Lines.lineAngle(e.x-1.5, e.y + offset, 0, 3);
    Lines.lineAngle(e.x, e.y-1.5 + offset, 90, 3);
  }),
  healSpread : newEffect(25, e => {
    Draw.color(Pal.surge, Pal.heal.cpy().a(0), e.fin());
    Lines.stroke(1);
    var offset = e.fin()*5;
    Angles.randLenVectors(e.id, 1, 6 + 5*e.fin(), floatc2((x, y) => {
      Lines.lineAngle(e.x-1.5 + x, e.y + y + offset, 0, 3);
      Lines.lineAngle(e.x + x, e.y-1.5 + y + offset, 90, 3);
    }));
  }),
  //credits to EyeofDarkness
  whirl : newEffect(65, e => {
    const v1 = new Vec2();
    for(var i = 0; i < 2; i++){
      var h = i * 2;
      var rand1 = Interpolation.exp5In.apply((Mathf.randomSeedRange(e.id + h, 1) + 1) / 2);
      var rand2 = (Mathf.randomSeedRange(e.id * 2 + h, 360) + 360) / 2;
      var rand3 = (Mathf.randomSeedRange(e.id * 4 + h, 5) + 5) / 2;
      var angle = rand2 + ((180 + rand3) * e.fin());

      v1.trns(angle, rand1 * 70 * e.fout());

      //Draw.color(Color.black);
      Draw.shader(spaceshader);
      Lines.stroke((1 * e.fout()) + 0.25);
      Lines.lineAngle(e.x + v1.x, e.y + v1.y, angle + 270 + 15, e.fout() * 8);
      Draw.shader();
    };
    Draw.color(Color.black);
		Fill.circle(e.x, e.y, e.rotation);
  }),
  whirlSmall : newEffect(45, e => {
    const v1 = new Vec2();
    for(var i = 0; i < 2; i++){
      var h = i * 2;
      var rand1 = Interpolation.exp5In.apply((Mathf.randomSeedRange(e.id + h, 1) + 1) / 2);
      var rand2 = (Mathf.randomSeedRange(e.id * 2 + h, 360) + 360) / 2;
      var rand3 = (Mathf.randomSeedRange(e.id * 4 + h, 5) + 5) / 2;
      var angle = rand2 + ((180 + rand3) * e.fin());

      v1.trns(angle, rand1 * 30 * e.fout());

      //Draw.color(Color.black);
      Draw.shader(spaceshader);
      Lines.stroke((1 * e.fout()) + 0.25);
      Lines.lineAngle(e.x + v1.x, e.y + v1.y, angle + 270 + 15, e.fout() * 5);
      Draw.shader();
    };
    Draw.color(Color.black);
		Fill.circle(e.x, e.y, e.rotation);
  }),
  poof : newEffect(65, e => {
    var v1 = Vec2((1-e.fout()*e.fout())*30,0);
    var r1 = e.fout()*270;
    var c1 = e.fout()*45; if(c1>3.5) c1=3.5;
    Draw.color(Color.black);
    for(var i=0;i<8;i++){
      v1.setAngle((r1+i*45)%360);
      Fill.circle(e.x+v1.x, e.y+v1.y, c1+1);
    }
    Draw.color((Time.time()%16>8)?Color.white:e.color);
    for(var i=0;i<8;i++){
      v1.setAngle((r1+i*45)%360);
      Fill.circle(e.x+v1.x, e.y+v1.y, c1);
    }
  }),
  poofBack : newEffect(65, e => {
    var v1 = Vec2((1-e.fin()*e.fin())*30,0);
    var r1 = e.fout()*270;
    var c1 = e.fin()*45; if(c1>3.5) c1=3.5;
    Draw.color(Color.black);
    for(var i=0;i<8;i++){
      v1.setAngle((r1+i*45)%360);
      Fill.circle(e.x+v1.x, e.y+v1.y, c1+1);
    }
    Draw.color((Time.time()%16>8)?Color.white:e.color);
    for(var i=0;i<8;i++){
      v1.setAngle((r1+i*45)%360);
      Fill.circle(e.x+v1.x, e.y+v1.y, c1);
    }
  })
};
