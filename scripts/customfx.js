var t = this;
var shieldColor = Color.valueOf("ffd37f").a(0.7);
const shieldInColor = Color.black.cpy().a(0);
const spaceshader = this.global.shaders.space;

const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");

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

function drawSpark(x, y, size, width, r){
  Drawf.tri(x, y, width, size, r);
  Drawf.tri(x, y, width, size, r+180);
  Drawf.tri(x, y, width, size, r+90);
  Drawf.tri(x, y, width, size, r+270);
}


function newGroundEffect(lifetime, staticLife, renderer){
  return new GroundEffectEntity.GroundEffect(lifetime, staticLife, new Effects.EffectRenderer({render: renderer}));
}
//thanks to EyeofDarkness(aka Darky Daddy)
const newEffectSize = (life, size, renderer) => new Effects.Effect(life, size, new Effects.EffectRenderer({render: renderer}));

const meltColor = Color.valueOf("ff9c5a");
const distcolor = Color.valueOf("4c00ff");
this.global.fx = {
  evalfx : newEffect(30, e => {
    if(e.data == null || !e.data.text || !e.data.parent) return;
    try{
      eval(e.data.text);
    }
    catch(err){
      e.data.parent.setErr(err);
    }
  }),
  evalfxLong : newEffect(90, e => {
    if(e.data == null || !e.data.text || !e.data.parent) return;
    try{
      eval(e.data.text);
    }
    catch(err){
      e.data.parent.setErr(err);
    }
  }),
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
    var r1 = e.fout()*170;
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
    var r1 = e.fout()*170;
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
  }),
  smokeRise : newEffectSize(150, 150, e => {
    Draw.color(Color.gray, Pal.darkishGray.cpy().a(0), e.fin());
    var size = 7 + e.fin()*8;
    Draw.rect("circle", e.x+e.fin()*26, e.y+e.fin()*30, size, size);
  }),
  campfire : newEffectSize(90, 50, e => {
    if(e.data == null) return;
    Angles.randLenVectors(e.id, e.id%3+1, 0.5+4*e.fin(), floatc2((x,y) => {
      Draw.color(e.color, e.data, y*y);
      Fill.circle(e.x+x, e.y+Math.abs(y*10)+e.fin()*3, e.fout()*(5+(e.id%4)*0.5));
    }));
  }),
  flashbang : newEffectSize(5, 170, e => {
    fillLight(e.x, e.y, Lines.circleVertices(85), 85, Color.white, Color.white.cpy().a(0));
    fillLight(e.x, e.y, Lines.circleVertices(85), 85, Color.white, Color.white.cpy().a(0));
    Draw.color();
  }),
  flashSpark : newEffect(40, e => {
    Draw.color(Color.white);
    var i=1;
    Angles.randLenVectors(e.id, e.id%2+1, 4+8*e.fin(), floatc2((x,y) => {
      drawSpark(e.x+x, e.y+y, e.fout()*2.5, 0.5+e.fout(), e.id*i);
      i++;
    }));
  }),
  empBlast : newEffect(25, e => {
    Draw.color(Pal.lancerLaser, Pal.surge, e.fout());
    Lines.stroke(e.fout()*4.5);
    var rand = Mathf.random();
    Lines.poly(e.x, e.y, rand*5+10, e.fin()*e.rotation, e.fout()*300);
    Lines.stroke(e.fout()*2);
    Lines.poly(e.x, e.y, rand*5+10, e.fin()*e.rotation*0.85, e.fout()*300);
  }),
  ballBounce : newEffect(30, e => {
    var v1 = Vec2(e.fin()*24, 0).setAngle(e.rotation+Mathf.randomSeed(e.id, 165, 195));
    Draw.alpha(e.fout());
    Draw.rect("commandblocks-b-ball-back", e.x+v1.x, e.y+v1.y, e.fin()*80);
    Draw.rect("commandblocks-b-ball", e.x+v1.x, e.y+v1.y);
  }),
  coreMainSquare : newEffectSize(90, 450, e => {
    Lines.stroke(15*e.fout());
    Draw.color(bitcolor1, bitcolor2, e.fin());
    Lines.square(e.x, e.y, e.finpow()*210+12, e.finpow()*135);
  }),
  coreMainSpark : newEffectSize(150, 800, e => {
    Draw.color(bitcolor1, bitcolor2, e.fout());
    drawSpark(e.x, e.y, e.fin()*700+40, e.fout()*54, (1-e.finpow())*215);
  }),
  coreMainPhase : newEffectSize(90, 70, e => {
    Draw.color(bitcolor1, bitcolor2, e.fin());

    Lines.stroke(Math.max(6*e.fout()-3, 0));
    Lines.square(e.x, e.y, 12);

    Angles.randLenVectors(e.id+1, 7, 90*e.finpow()+12, floatc2((x,y) => {
      Fill.square(e.x+x, e.y+y, e.fout()*3, 45);
    }));

    Draw.color(bitcolor1, bitcolor2, e.fout());
    Angles.randLenVectors(e.id, 7, 90*e.finpow()+12, floatc2((x,y) => {
      Fill.square(e.x+x, e.y+y, e.fout()*3, 45);
    }));
  }),
  bittriumCenter : newEffect(300, e => {
    var size = Mathf.sin(Time.time()*0.1)*0.5 + 3;
    Draw.color(bitcolor1, bitcolor2, Mathf.sin(Time.time()*0.041));
    Draw.alpha(e.fout()*5);
    Fill.square(e.x, e.y, size, 45);
    Draw.color();
    Draw.alpha(e.fout()*2);
    Fill.square(e.x, e.y, size-1, 45);
  }),
  bittriumSquare : newEffect(90, e => {
    Lines.stroke(e.fout()*2);
    Draw.shader(t.global.shaders.bittrium);
    Lines.square(e.x, e.y, e.finpow()*8, e.finpow()*45+45);
    Draw.shader();
  }),
  bittriumCharge : newEffect(30, e => {
    Draw.color(bitcolor1, bitcolor2, Mathf.sin(Time.time()*0.041));
    Angles.randLenVectors(e.id, 1, 20*e.fout(), floatc2((x,y) => {
      Fill.circle(e.x+x, e.y+y, e.finpow()*1.5);
    }));
  }),
  placeOre : newEffect(30, e => {
    Draw.color(e.color);
    Lines.stroke(e.fout()*4);
    Lines.square(e.x, e.y, e.fin()*2+3);
  }),
  shine : newEffect(30, e => {
    Draw.color(Color.white, e.color, e.finpow());
    drawSpark(e.x, e.y, e.fout()*2, e.finpow()*15, 0);
    Lines.stroke(e.fout());
    Lines.circle(e.x, e.y, e.finpow()*5);
  }),
  chargeShine : newEffect(20, e => {
    Draw.color(Pal.accent, Color.white.cpy().a(0), 1-e.fout()*2);
    Lines.stroke(e.fout());
    Angles.randLenVectors(e.id, 2+e.id%2, 30*e.fout(), floatc2((x,y) => {
      drawSpark(e.x+x, e.y+y, e.finpow()*5, e.finpow()*13, 0);
      Lines.circle(e.x, e.y, e.finpow()*4.5);
    }));
  }),
  rageShine : newEffect(20, e => {
    Lines.stroke(e.fout()*2.5);
    Draw.color(Color.purple, Color.white, e.fin());
    Lines.lineAngleCenter(e.x, e.y+e.fin()*6, 90, e.fin()*5.5+5.5);
  }),
  meltChargeFx : newEffect(25, e => {
    Draw.color(meltColor, Color.white, e.fin());
    Angles.randLenVectors(e.id, 3+e.id%3, 70*e.fout(), floatc2((x,y) => {
      Fill.square(e.x+x, e.y+y, e.fin()*4.5, 45);
    }));
  }),
  wormSmallFx : newEffect(60, e => {
    Draw.color(distcolor, Pal.lancerLaser, 0.8+0.5*Mathf.sin(16*e.fin()));
    var r = e.fin()*(1-e.fin())*2;
    Fill.circle(e.x, e.y, 40*r);
    Lines.swirl(e.x, e.y, 42*r, 0.6, Time.time()*13);
    Lines.swirl(e.x, e.y, 43*r, 0.4, Time.time()*-11+121);
    Draw.color(Color.black);
    Fill.circle(e.x, e.y, 25*r);
    Lines.swirl(e.x, e.y, 26*r, 0.7, Time.time()*-5+121);
    Lines.swirl(e.x, e.y, 27*r, 0.3, Time.time()*19+222);
  }),
  spawnWellTrail : newEffect(30, e => {
    Tmp.c1.set(Color.red);
    Draw.color(Tmp.c1.shiftHue(Mathf.randomSeed(e.id)*255));
    drawSpark(e.x, e.y, e.fout()*2, e.finpow()*15, 0);
    Lines.stroke(e.fout());
    Lines.circle(e.x, e.y, e.finpow()*5);
  })
};
