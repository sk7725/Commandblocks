

if(typeof(newEffectDst)=="undefined"){
  function newEffectDst(lifetime,dst,renderer){
    return new Effects.Effect(lifetime,dst,new Effects.EffectRenderer({render:renderer}));
  }
}
/*
const boom=newEffectDst(80,480,e=>{
  const scale=e.data.splashDamageRadius;
  const scaleCen=[scale*0.5*0.4,scale*0.5*0.7,scale*0.5];
  const colorCen=[Color.yellow,Color.valueOf("ffa500d4"),Color.valueOf("ff0000a9")];
  const colorSmoke=[Color.valueOf("646464a9"),Color.valueOf("787878d4")];
  for(var i=scaleCen.length-1;i>=0;i--){
      Draw.color(colorCen[i]);
      Fill.circle(e.x,e.y,e.fslope()*scaleCen[i]);
  }
  for(var i=0;i<colorSmoke.length;i++){
    Draw.color(colorSmoke[i]);
    Lines.stroke(e.fin()*scale/ (16*(0.5+i)) );
    Lines.circle(e.x,e.y,e.finpow()*scale);
  }
  for(var i=0;i<colorSmoke.length;i++){
    Draw.color(colorSmoke[i]);
    Lines.stroke(Math.max(e.fin()-0.2,0)*scale/ (16*(0.5+i)) );
    Lines.circle(e.x,e.y,Math.max(e.finpow()-0.2,0)*scale);
  }
});
const launch=newEffect(120,e=>{
  const scale=40;
  const colorSmoke=[Color.valueOf("646464a9"),Color.valueOf("787878d4")];
  const launchScales=[6,5,4.5,3];
  const colorLaunch=[Color.valueOf("ff0000a9"),Color.valueOf("ffa500d4"),Color.valueOf("646464"),Color.valueOf("787878")];
  for(var i=0;i<colorLaunch.length;i++){
    Draw.color(colorLaunch[i]);
    Fill.circle(e.x,e.y,(i<=1?0.95+Mathf.absin(e.time,1,0.1):1)*(0.5+0.5*e.fout())*launchScales[i]);
  }
  var actualFin=10*e.finpow()-Math.floor(10*e.finpow());
  for(var i=0;i<colorSmoke.length;i++){
    Draw.color(colorSmoke[i]);
    Lines.stroke(actualFin*scale/(6*(0.5+i)));
    Lines.circle(e.x,e.y,actualFin*scale);
  }
  for(var i=0;i<colorSmoke.length;i++){
    Draw.color(colorSmoke[i]);
    Lines.stroke(Math.max(actualFin-0.2,0)*scale/ (16*(0.5+i)) );
    Lines.circle(e.x,e.y,Math.max(actualFin-0.2,0)*scale);
  }
  if(actualFin<=0.2) Sounds.respawn.at(e.data);
});
const launchpad=extendContent(ItemTurret,"launchpad",{
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.booster);
  },
  setBars(){
    this.super$setBars();
    this.bars.remove("liquid");
    this.bars.remove("items");
  },
  acceptLiquid(tile,source,liquid,amount){
    return false;
  },
  buildConfiguration(tile,table){
    const entity=tile.ent();
    var group=new ButtonGroup();
    group.setMinCheckCount(0);
    group.setMaxCheckCount(-1);
    for(var i=0;i<2;i++){
      (function (i,tile){
        var button=table.addImageButton(i==0?Vars.ui.getIcon("command"+Strings.capitalize(UnitCommand.rally.name())):Icon.settings,Styles.clearToggleTransi,run(()=>tile.configure(i))).size(44).group(group).update(cons(b=>b.setChecked(entity.getLaunchInterval()>0&&i==0?true:entity.getToggle()==1&&entity.getToggle()==i?true:false)));
      })(i,tile)
    }
  },
  configured(tile,player,value){
    const entity=tile.ent();
    entity.setToggle(value==0&&entity.getLaunchInterval()>0?-1:value);
  },
  onConfigureTileTapped(tile,other){
    const entity=tile.ent();
    if(entity.getToggle()!=1) return this.super$onConfigureTileTapped(tile,other);
    entity.setToggle(-1);
    entity.setTargetSpot(other);
    return true;
  },
  update(tile){
    const entity=tile.ent();
    if(entity.getTargetSpot()==null) entity.setTargetSpot(tile);
    entity.timerLaunchInterval();
    entity.heat=Mathf.lerpDelta(entity.heat,0,1/120);
    entries=entity.getLaunchTimer().length;
    for(var i=0;i<entries;i++){
      entity.getLaunchTimer()[i]-=Time.delta();
    }
    if(entity.getToggle()==0) {
      entity.setToggle(-1);
      if(this.hasAmmo(tile)){
        Effects.effect(launch,tile.drawx(),tile.drawy(),0,tile);
        entity.heat=1;
        entity.setLaunchInterval(120);
        const spot=entity.getTargetSpot();
        const type=this.useAmmo(tile);
        entity.getLaunchEntry().unshift(type);
        entity.getLaunchEntry().unshift(spot);
        entity.getLaunchTimer().unshift(this.reload);
      }
    }
    if(entity.getLaunchTimer()[entries-1]<=0){
      var tilex=entity.getLaunchEntry()[entries*2-2].worldx();
      var tiley=entity.getLaunchEntry()[entries*2-2].worldy();
      var radius=entity.getLaunchEntry()[entries*2-1].splashDamageRadius;
      Sounds.explosionbig.at(entity.getLaunchEntry()[entries*2-2]);
      entity.getLaunchTimer().splice(entries-1,1);
      Damage.damageUnits(tile.getTeam(),tilex,tiley,radius,0,boolf(e=>{return Mathf.dst(tilex,tiley,e.x,e.y)<=radius}),cons((e2)=>{e2.damage(entity.getLaunchEntry()[entries*2-1].splashDamage*Mathf.lerp(1-Mathf.dst(tilex,tiley,e2.getX(),e2.getY())/radius,1,0.4))}));
      var trad=Math.floor(radius/Vars.tilesize);
      for(var dx=-trad;dx<=trad;dx++){
        for(var dy=-trad;dy<=trad;dy++){
          var _tile=Vars.world.tile(Math.round(tilex/Vars.tilesize)+dx,Math.round(tiley/Vars.tilesize)+dy);
          if(_tile!=null&&_tile.entity!=null&&(tile.getTeam()==null||Vars.state.teams.areEnemies(tile.getTeam(),_tile.getTeam()))&&Mathf.dst(dx,dy)<=trad){
            _tile.entity.damage(entity.getLaunchEntry()[entries*2-1].splashDamage*Mathf.lerp(1-Mathf.dst(tilex,tiley,_tile.worldx(),_tile.worldy())/radius,1,0.4));
          }
        }
      }
      Effects.effect(boom,tilex,tiley,0,entity.getLaunchEntry()[entries*2-1]);
      entity.getLaunchEntry().splice(entries*2-2,2);
    }
  },
  drawSelect(tile){
    const entity=tile.ent();
    if(entity.getTargetSpot()==null) entity.setTargetSpot(tile);
    var spot=entity.getTargetSpot();
    Drawf.dashCircle(spot.worldx(),spot.worldy(),10,tile.getTeam().color);
    if(this.hasAmmo(tile)) Drawf.dashCircle(spot.worldx(),spot.worldy(),this.peekAmmo(tile).splashDamageRadius,tile.getTeam().color);
    if(entity.getLaunchTimer()[0]!=null){
      const entries=entity.getLaunchTimer().length;
      for(var i=0;i<entries;i++){
        (function(i,tile,entity){
          Drawf.dashCircle(entity.getLaunchEntry()[i*2].worldx(),entity.getLaunchEntry()[i*2].worldy(),entity.getLaunchEntry()[i*2+1].splashDamageRadius,Color.red);
        })(i,tile,entity)
      }
    }
  },
  drawConfigure(tile){
    this.super$drawConfigure(tile);
    if(tile.entity.getToggle()==1) {
      var vec=Core.input.mouseWorld(Vars.control.input.getMouseX(),Vars.control.input.getMouseY());
      if(this.hasAmmo(tile)) Drawf.dashCircle(vec.x,vec.y,this.peekAmmo(tile).splashDamageRadius,tile.getTeam().color);
      Drawf.dashCircle(vec.x,vec.y,10,tile.getTeam().color);
    }
  },
  drawLayer(tile){
    const entity=tile.ent();
    Draw.rect(this.region,tile.drawx(),tile.drawy(),0);
    this.heatDrawer.get(tile,entity);
  },
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name+"-base"),
      Core.atlas.find(this.name)
    ];
  }
});
launchpad.entityType=prov(()=>extendContent(ItemTurret.ItemTurretEntity,launchpad,{
  getTargetSpot(){
    return this._targetSpot;
  },
  setTargetSpot(a){
    this._targetSpot=a;
  },
  _targetSpot:null,
  getToggle(){
    return this._toggle;
  },
  setToggle(b){
    this._toggle=b;
  },
  _toggle:-1,
  getLaunchEntry(){
    return this._launchEntry;
  },
  _launchEntry:[],
  getLaunchTimer(){
    return this._launchTimer;
  },
  _launchTimer:[],
  getLaunchInterval(){
    return this._launchInterval;
  },
  setLaunchInterval(c){
    this._launchInterval=c;
  },
  timerLaunchInterval(){
    if(this._launchInterval>0) this._launchInterval-=Time.delta();
    else this._launchInterval=0;
  },
  _launchInterval:0,
  write(stream){
    this.super$write(stream);
    stream.writeShort(this._targetSpot.x);
    stream.writeShort(this._targetSpot.y);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._targetSpot=Vars.world.tile(stream.readShort(),stream.readShort());
  },
}));
launchpad.configurable=true;*/

bullet1=extend(BasicBulletType,{
  hit(b,x,y){
    this.super$hit(b,x!=null?x:b.x,y!=null?y:b.y);
    if(!(b.getOwner() instanceof ItemTurret.ItemTurretEntity)) return;
    var i=b.getOwner().getPierce();
    if(i==0){
      b.remove();
    }
  },
});
bullet1.damage=500;
bullet1.pierce=true;
bullet1.speed=15;
bullet1.bulletWidth=9;
bullet1.bulletHeight=36;
bullet1.ammoMultiplier=5;
bullet1.lifetime=30;
bullet1.knockback=2.4;
bullet1.hitEffect=Fx.hitBulletBig;
bullet2=extend(BasicBulletType,{
  hit(b,x,y){
    this.super$hit(b,x!=null?x:b.x,y!=null?y:b.y);
    if(!(b.getOwner() instanceof ItemTurret.ItemTurretEntity)) return;
    var i=b.getOwner().getPierce();
    if(i==0){
      b.remove();
    }
  },
});
bullet2.damage=330;
bullet2.pierce=true;
bullet2.speed=12.5;
bullet2.bulletWidth=6;
bullet2.bulletHeight=24;
bullet2.ammoMultiplier=5;
bullet2.lifetime=36;
bullet2.knockback=1.8;
bullet2.hitEffect=Fx.hitBulletBig;
const penetrate=extendContent(ItemTurret,"penetrate",{
  powerUse:3,
  init(){
    this.hasPower=true;
    this.consumes.powerCond(this.powerUse,boolf(entity=>entity!=null?entity.target!=null:false));
    this.ammo(Vars.content.getByName(ContentType.item,"copper"),bullet2,Vars.content.getByName(ContentType.item,"lead"),bullet1);
    this.super$init();
  },
  baseReloadSpeed(tile){
    return tile.isEnemyCheat()?1:tile.entity.power.status;
  },
  shoot(tile,type){
    this.super$shoot(tile,type);
    tile.entity.resetPierce();
  }
});
penetrate.entityType=prov(()=>extendContent(ItemTurret.ItemTurretEntity,penetrate,{
  getPierce(){
    if(this._pierce>0){
      this._pierce--;
    }
    return this._pierce
  },
  resetPierce(){
    this._pierce=7;
  },
  _pierce:7,
}));
penetrate.heatColor=Color.red;


if(floatc2===undefined)  const floatc2=method=>new Floatc2(){get:method};


const ray=extendContent(PowerTurret,"ray",{
  shootDuration:40,
  getrotX(degree,distance){
    degree=Math.PI*degree/180;
    var pointX=distance*Mathf.cos(degree);
    return pointX;
  },
  getrotY(degree,distance){
    degree=Math.PI*degree/180;
    var pointY=distance*Mathf.sin(degree);
    return pointY;
  },
  //미관통 레이저 거리계산용
  distCal(tile){
    if(tile.entity==null||tile.entity.target==null) return;
    var dx=tile.entity.getX()-tile.entity.target.getX();
    var dy=tile.entity.getY()-tile.entity.target.getY();
    tile.entity.modifyDist(Mathf.sqrt(dx*dx+dy*dy));
  },
  // 물 못받게 하기
  handleLiquid(tile,source,liquid,amount){},
  acceptLiquid(tile,source,liquid,amount){},
  setBars(){
    this.super$setBars();
    this.bars.remove("liquid");
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(BlockStat.booster);
    this.stats.remove(BlockStat.damage);
    this.stats.add(BlockStat.damage,this.shootType.damage*60/5,StatUnit.perSecond);
  },
  //지속딜 구현
  update(tile){
    this.super$update(tile);
    this.distCal(tile);
    if(tile.entity.getLife()>0&&tile.entity.getBullet()!=null){
      this.findTarget(tile);
      this.tr.trns(tile.entity.rotation,this.size*this.tilesize/2,0);
      tile.entity.getBullet().set(tile.drawx()+this.getrotX(tile.entity.rotation,this.size*4),tile.drawy()+this.getrotY(tile.entity.rotation,this.size*4));
      tile.entity.getBullet().rot(tile.entity.rotation);
      tile.entity.heat=1;
      tile.entity.recoil=this.recoil;
      tile.entity.getBullet().time(0);
      tile.entity.subLife(Time.delta());
      if(tile.entity.getLife()<=0){
        tile.entity.modifyBullet(null);
      }
    }else{
      tile.entity.decreaseDamage();
    }
  },
  bullet(tile,type,angle){
    tile.entity.modifyBullet(Bullet.create(type,tile.entity,tile.getTeam(),tile.drawx()+this.tr.x,tile.drawy()+this.tr.y,angle));
  },
  shouldActiveSound(tile){
    return tile.entity.getLife()>0&&tile.entity.getBullet()!=null;
  },
  updateShooting(tile){
    const entity=tile.ent();
    if(entity.cons.valid()) entity.modifyLife(10);

    if(entity.getLife()>0&&entity.getBullet()!=null){
      entity.increaseDamage();
      return;
    }

    if(entity.reload>=this.reload&&(entity.cons.valid()||tile.isEnemyCheat())){
      var type=this.peekAmmo(tile);
      this.shoot(tile,type);
      entity.reload=0;
    }else{
      entity.reload+=entity.delta();
    }
  },
  //무조건 가장 가까운 적 공격
  findTarget(tile){
    const entity=tile.entity;
    const old=entity.target;
    if(this.targetAir&&!this.targetGround){
      entity.target=Units.closestEnemy(tile.getTeam(),tile.drawx(),tile.drawy(),this.range,boolf(e=>e.isFlying()&&!e.isDead()));
    }else{
      entity.target=Units.closestTarget(tile.getTeam(),tile.drawx(),tile.drawy(),this.range,boolf(e=>!e.isDead()&&(!e.isFlying()||this.targetAir)&&(e.isFlying()||this.targetGround)));
    }
    if(old!=entity.target) entity.decreaseDamage()
  }
});
//지속딜용 엔티티속성 추가
ray.entityType=prov(()=>extend(Turret.TurretEntity,{
  getLife(){
    return this.bulletLife;
  },
  modifyLife(a){
    this.bulletLife=a;
  },
  subLife(b){
    this.bulletLife-=b;
  },
  getBullet(){
    return this._bullet;
  },
  modifyBullet(c){
    this._bullet=c;
  },
  modifyDist(d){
    this._dist=d;
  },
  getDist(){
    return this._dist;
  },
  increaseDamage(){
    if(this._damageMultiplier<2.5){
      this._damageMultiplier+=this.delta()/160;
    }else if(this._damageMultiplier>2.5){
      this._damageMultiplier=2.5;
    }
  },
  decreaseDamage(){
    this._damageMultiplier=1;
  },
  getDamage(){
    return this._damageMultiplier;
  },
  _bullet:null,
  bulletLife: 0,
  _dist:0,
  _damageMultiplier:1,
}));
ray.heatColor=Color.red;
ray.rotatespeed=2;
//커스텀 레이저
var colors=[Color.forest.cpy().mul(1,1,1,0.4),Color.lime.cpy().mul(1,1,1,0.7),Color.green,Color.acid];
var tscales=[1,0.7,0.5,0.2];
var lenscales=[-20,-13,-6,1];
var length=240;
var circlescales=[10,8,6,4];
const hitLaser1 = newEffect(5,e=>{
  for(var i=1;i<circlescales.length;i++){
    Draw.color(colors[i]);
    Fill.circle(e.x,e.y,circlescales[i]*e.fout());
    Draw.color(colors[1]);
    Lines.stroke(e.fout()*2);
    Angles.randLenVectors(e.id,2,e.finpow()*18,e.rotation,360,floatc2((x,y)=>{
      var ang=Mathf.angle(x,y);
      Lines.lineAngle(e.x+x,e.y+y,ang,e.fout()*4+1);
    }))
  }

});
ray.shootType = extend(BasicBulletType,{
  //관통데미지
  update(b){
    if(b==null || b.getOwner() == null) return;
    if(b.timer.get(1,5)){
      const target=b.getOwner().target;
      //print(b.getOwner().getDamage())
      if(target!=null){
        var result=Predict.intercept(b.getOwner(),target,this.speed);
        if(result.isZero()) result.set(target.getX(),target.getY());
        var targetRot=result.sub(b.getOwner().tile.drawx(),b.getOwner().tile.drawy()).angle();
        if(Angles.angleDist(b.getOwner().rotation,targetRot)<10){
          target.damage(this.damage*b.getOwner().getDamage());
          this.hit(b,target.x,target.y);
        }
      }
    }
    Effects.shake(1,1,b.x,b.y);
  },
  //화염 적용
  hit(b,hitx,hity){
    Effects.effect(this.hitEffect,colors[3],hitx!=null?hitx:b.x,hity!=null?hity:b.y);
    if(Mathf.chance(0.4)){
      Fire.create(Vars.world.tileWorld(hitx + Mathf.range(5), hity + Mathf.range(5)));
    }
  },
  draw(b){
    if(b==null || b.getOwner() == null) return;
    var baseLen=length*b.fout();
    for(var s=0;s<colors.length;s++){
      Draw.color(colors[s]);
      for(var i=0;i<colors.length;i++){
        Lines.stroke((7+Mathf.absin(Time.time(),0.8,1.5))*b.fout()*(s==0 ? 1.5:s==1 ? 1.1:s==2?0.7:0.3)*tscales[i]);
        Lines.lineAngle(b.x,b.y,b.rot(),b.getOwner().getDist()+lenscales[i]>0?b.getOwner().getDist()+lenscales[i]:1);
      }
    }
    Draw.reset();
  }
});
ray.shootType.hitSize=3;
ray.shootType.despawnEffect=Fx.none;
ray.shootType.hitEffect=hitLaser1;
ray.shootType.damage=45;
ray.shootType.pierce=true;
ray.shootType.speed=0.001;
ray.shootType.lifetime=16;

const plasmaBoom1=newEffect(48,e=>{
  Draw.color(Color.white);
  Lines.stroke(e.fout()*2)
  Angles.randLenVectors(e.id,30,e.finpow()*60,e.rotation,360,floatc2((x,y)=>{
    var ang=Mathf.angle(x,y);
    Lines.lineAngle(e.x+x,e.y+y,ang,e.fout()*4+1);
  }))
})
const plasmaBoom2=newEffect(48,e=>{
  Draw.color(Color.valueOf("f4ba6e"));
  Lines.stroke(e.fout()*2)
  Angles.randLenVectors(e.id,30,e.finpow()*60,e.rotation,360,floatc2((x,y)=>{
    var ang=Mathf.angle(x,y);
    Lines.lineAngle(e.x+x,e.y+y,ang,e.fout()*4+1);
  }))
})
const plasma1=extend(FlakBulletType,{
  vec:new Vec2(),
  cColors:[Pal.lancerLaser.cpy().mul(1,1,1,0.4),Pal.lancerLaser,Color.white],
  cScales:[1,0.7,0.4],
  draw(b){
    for(var i=0;i<this.cColors.length;i++){
      Draw.color(this.cColors[i]);
      Fill.circle(b.x,b.y,this.splashDamageRadius*this.cScales[i]*(0.4+0.6*b.fin()));
    }
  },
  hit(b,hitx,hity){
    if(b==null) return;
    x=hitx==null?b.x:hitx;
    y=hity==null?b.y:hity;
    Effects.effect(plasmaBoom1,b.x,b.y,b.rot());
    this.hitSound.at(b,1/Math.pow(2,1));
    Fire.create(Vars.world.tileWorld(hitx+Mathf.range(5),hity+Mathf.range(5)));
    Damage.damage(b.getTeam(),x,y,1.6*this.splashDamageRadius*(0.4+0.6*b.fin()),this.splashDamage*b.damageMultiplier()/(0.4+0.6*b.fin()));
  },
  despawned(b){
    if(b==null) return;
    this.hit(b);
  },
  update(b){
    if(b==null) return;
    this.vec.trns(b.rot(),this.speed*4);
    if(Mathf.chance(0.4*Time.delta())) Lightning.createLighting(Lightning.nextSeed(),b.getTeam(),Pal.lancerLaser,8,b.x+this.vec.x,b.y+this.vec.y,Mathf.random(360),Math.floor(0.4*this.splashDamageRadius*(0.3+0.7*b.fin())));
    try {
      if(b.timer.get(2,6)){
        Units.nearbyEnemies(b.getTeam(),this.rect.setSize(this.splashDamageRadius*1.8*(0.4+0.6*b.fin())).setCenter(b.x,b.y),cons((unit)=>{
          try{
            if(unit.dst(b)<this.splashDamageRadius*1.8*(0.4+0.6*b.fin())){
              b.setData(0);
              Time.run(5,run(()=>{
                try {this.despawned(b);
                  b.remove();}
                catch(e){}
              }))
            }
          } catch(e) {return;}
          }))
      }
    }catch(e) {return;}
  }
});
plasma1.speed=2;
plasma1.damage=0;
plasma1.knockback=2;
plasma1.lifetime=160;
plasma1.splashDamageRadius=30;
plasma1.splashDamage=200;
plasma1.hitSound=Sounds.artillery;
plasma1.ammoMultiplier=1;
const plasma2=extend(FlakBulletType,{
  vec:new Vec2(),
  cColors:[Color.valueOf("f4ba6e").cpy().mul(1,1,1,0.4),Color.valueOf("f4ba6e"),Color.white],
  cScales:[1,0.7,0.4],
  draw(b){
    for(var i=0;i<this.cColors.length;i++){
      Draw.color(this.cColors[i]);
      Fill.circle(b.x,b.y,this.splashDamageRadius*this.cScales[i]*(0.4+0.6*b.fin()));
    }
  },
  hit(b,hitx,hity){
    if(b==null) return;
    x=hitx==null?b.x:hitx;
    y=hity==null?b.y:hity;
    Effects.effect(plasmaBoom2,b.x,b.y,b.rot());
    this.hitSound.at(b,1/Math.pow(2,1));
    Fire.create(Vars.world.tileWorld(hitx+Mathf.range(5),hity+Mathf.range(5)));
    Damage.damage(b.getTeam(),x,y,1.6*this.splashDamageRadius*(0.4+0.6*b.fin()),this.splashDamage*b.damageMultiplier()/(0.4+0.6*b.fin()));
  },
  despawned(b){
    if(b==null) return;
    this.hit(b);
  },
  update(b){
    if(b==null) return;
    this.vec.trns(b.rot(),this.speed*4);
    if(Mathf.chance(0.4*Time.delta())) Lightning.createLighting(Lightning.nextSeed(),b.getTeam(),Color.valueOf("f4ba6e"),8,b.x+this.vec.x,b.y+this.vec.y,Mathf.random(360),Math.floor(0.4*this.splashDamageRadius*(0.3+0.7*b.fin())));
    try {
      if(b.timer.get(2,6)){
        Units.nearbyEnemies(b.getTeam(),this.rect.setSize(this.splashDamageRadius*1.8*(0.4+0.6*b.fin())).setCenter(b.x,b.y),cons((unit)=>{
          try{
            if(unit.dst(b)<this.splashDamageRadius*1.8*(0.4+0.6*b.fin())){
              b.setData(0);
              Time.run(5,run(()=>{
                try {this.despawned(b);
                  b.remove();}
                catch(e){}
              }))
            }
          } catch(e) {return;}
          }))
      }
    }catch(e) {return;}
  }
});
plasma2.speed=2;
plasma2.damage=0;
plasma2.knockback=2;
plasma2.lifetime=160;
plasma2.splashDamageRadius=30;
plasma2.splashDamage=600;
plasma2.hitSound=Sounds.artillery;

const plasma3=extend(FlakBulletType,{
  vec:new Vec2(),
  cColors:[Color.valueOf("82ffe866") ,Color.valueOf("82ffe8"), Color.white],
  cScales:[1,0.7,0.4],
  draw(b){
    for(var i=0;i<this.cColors.length;i++){
      Draw.color(this.cColors[i]);
      Fill.circle(b.x,b.y,this.splashDamageRadius*this.cScales[i]*(0.4+0.6*b.fin()));
    }
  },
  hit(b,hitx,hity){
    if(b==null) return;
    x=hitx==null?b.x:hitx;
    y=hity==null?b.y:hity;
    Effects.effect(plasmaBoom1,b.x,b.y,b.rot());
    this.hitSound.at(b,1/Math.pow(2,1));
    Fire.create(Vars.world.tileWorld(hitx+Mathf.range(5),hity+Mathf.range(5)));
    Damage.damage(b.getTeam(),x,y,1.6*this.splashDamageRadius*(0.4+0.6*b.fin()),this.splashDamage*b.damageMultiplier()/(0.4+0.6*b.fin()));
  },
  despawned(b){
    if(b==null) return;
    this.hit(b);
  },
  update(b){
    if(b==null) return;
    this.vec.trns(b.rot(),this.speed*4);
    if(Mathf.chance(0.4*Time.delta())) Lightning.createLighting(Lightning.nextSeed(),b.getTeam(),Pal.lancerLaser,8,b.x+this.vec.x,b.y+this.vec.y,Mathf.random(360),Math.floor(0.4*this.splashDamageRadius*(0.3+0.7*b.fin())));
    try {
      if(b.timer.get(2,6)){
        Units.nearbyEnemies(b.getTeam(),this.rect.setSize(this.splashDamageRadius*1.8*(0.4+0.6*b.fin())).setCenter(b.x,b.y),cons((unit)=>{
          try{
            if(unit.dst(b)<this.splashDamageRadius*1.8*(0.4+0.6*b.fin())){
              b.setData(0);
              Time.run(5,run(()=>{
                try {this.despawned(b);
                  b.remove();}
                catch(e){}
              }))
            }
          } catch(e) {return;}
          }))
      }
    }catch(e) {return;}
  }
});
plasma3.speed=2;
plasma3.damage=0;
plasma3.knockback=2;
plasma3.lifetime=160;
plasma3.splashDamageRadius=30;
plasma3.splashDamage=1540;
plasma3.hitSound=Sounds.artillery;
plasma3.ammoMultiplier=4;
plasma3.reloadMultiplier = 0.4;
const ravage=extendContent(ItemTurret,"ravage",{
  vec:new Vec2(),
  powerUse:4.5,
  cColors1:[Pal.lancerLaser.cpy().mul(1,1,1,0.4),Pal.lancerLaser,Color.white],
  cColors2:[Color.valueOf("f4ba6e").cpy().mul(1,1,1,0.4),Color.valueOf("f4ba6e"),Color.white],
  cScales:[1,0.9,0.8],
  soundTimer:0,
  init(){
    this.hasPower=true;
    this.consumes.powerCond(this.powerUse,boolf(entity=>entity!=null?entity.target!=null:false));
    this.ammo(Items.graphite,plasma1,Items.phasefabric,plasma2,Vars.content.getByName(ContentType.item,"commandblocks-ref-zeta"),plasma3);
    this.super$init();
    this.soundTimer=this.timers++;
  },
  baseReloadSpeed(tile){
    return tile.isEnemyCheat()?1:tile.entity.power.status;
  },
  drawLayer(tile){
    const entity=tile.ent();
    this.tr2.trns(entity.rotation,-entity.recoil);
    this.vec.trns(entity.rotation,Vars.tilesize*this.size/2);
    this.drawer.get(tile,entity);
    this.heatDrawer.get(tile,entity);
    Draw.rect(this.barrelRegion,tile.drawx()+2*this.tr2.x,tile.drawy()+2*this.tr2.y,entity.rotation-90);
    if(this.hasAmmo(tile)&&entity.target!=null&&entity.cons.valid()){
      var fin=entity.reload/this.reload;
      var afin=10*fin-Math.floor(10*fin);
      if(entity.timer.get(this.soundTimer,20)) Sounds.message.at(tile,1/Math.pow(2,22/12));
      for(var i=0;i<this.cColors1.length;i++){
        Draw.color(this.peekAmmo(tile).splashDamage!=600?this.cColors1[i]:this.cColors2[i]);
        Fill.circle(tile.drawx()+this.vec.x+this.tr2.x,tile.drawy()+this.vec.y+this.tr2.y,this.peekAmmo(tile).splashDamageRadius*this.cScales[i]*(Math.max(fin-0.2,0))*0.5);
      }
      var bfin=(Time.time()%this.reload)/this.reload;
      var cfin=10*bfin-Math.floor(10*bfin);
      Angles.randLenVectors(Math.floor(10*bfin),18,18*(1-cfin),entity.rotation,360,floatc2((x,y)=>{
        var ang=Mathf.angle(x,y);
        Lines.lineAngle(tile.drawx()+this.vec.x+this.tr2.x+x,tile.drawy()+this.vec.y+this.tr2.y+y,ang,(1-cfin)*4+1);
      }))
    }
  },
  load(){
    this.super$load();
    this.barrelRegion=Core.atlas.find(this.name+"-barrel")
  }
});
ravage.heatColor=Color.red;
ravage.shootSound=Sounds.release;

/*
const tesla=extendContent(PowerTurret,"tesla",{
  bullet(tile,type,angle){
    Bullet.create(type,tile.entity,tile.getTeam(),tile.drawx(),tile.drawy(),angle);
  },
  drawLayer(tile){
    const entity=tile.ent();
    Draw.rect(this.region,tile.drawx(),tile.drawy(),0);
    if(this.heatRegion!=Core.atlas.find("error")){
      this.heatDrawer.get(tile,entity);
    }
  }
});
tesla.shootType=extend(BasicBulletType,{
  draw(b){},
  init(b){
    if(b==null) return;
    Lightning.create(b.getTeam(),Pal.lancerLaser,this.damage,b.x,b.y,b.rot(),24+Mathf.round(Mathf.random()*16));
  }
});
tesla.shootType.lifetime=1
tesla.shootType.speed=0.001
tesla.shootType.hitEffect=Fx.hitLancer;
tesla.shootType.damage=32;
tesla.heatColor=Color.red;
*/

const customLaser=extend(BasicBulletType,{
  tmpColor:new Color(),
  colors:[Color.valueOf("6464ff55"),Color.valueOf("6464ffaa"),Color.valueOf("5078ff"),Color.white],
  tscales:[1,0.7,0.5,0.2],
  strokes:[4,3,2,0.6],
  lenscales:[1,1.12,1.15,1.17],
  length:280,
  update(b){
    if(b==null) return;
    if(b.timer.get(1,5)){
      Damage.collideLine(b,b.getTeam(),this.hitEffect,b.x+3*Mathf.sinDeg(b.rot()),b.y+3*Mathf.cosDeg(b.rot()),b.rot(),this.length,true);
      Damage.collideLine(b,b.getTeam(),this.hitEffect,b.x-3*Mathf.sinDeg(b.rot()),b.y-3*Mathf.cosDeg(b.rot()),b.rot(),this.length,true);
    }
    Effects.shake(1,1,b.x,b.y);
  },
  hit(b,hitx,hity){
    Effects.effect(this.hitEffect,this.colors[2],hitx!=null?hitx:b.x,hity!=null?hity:b.y);
    if(Mathf.chance(0.4)){
      Fire.create(Vars.world.tileWorld(hitx+Mathf.range(5),hity+Mathf.range(5)));
    }
  },
  draw(b){
    var baseLen=this.length*b.fout();
    Lines.lineAngle(b.x,b.y,b.rot(),baseLen);
    for(var s=0;s<this.colors.length;s++){
      Draw.color(this.tmpColor.set(this.colors[s]).mul(1+Mathf.absin(Time.time(),1,0.1)));
      for(var i=0;i<this.tscales.length;i++){
        Tmp.v1.trns(b.rot()+180,(this.lenscales[i]-1)*35);
        Lines.stroke((9+Mathf.absin(Time.time(),0.8,1.5))*b.fout()*this.strokes[s]*this.tscales[i]);
        Lines.lineAngle(b.x+Tmp.v1.x,b.y+Tmp.v1.y,b.rot(),baseLen*this.lenscales[i],CapStyle.none);
      }
    }
    Draw.reset();
  }
});
customLaser.hitEffect=Fx.hitMeltdown;
customLaser.despawnEffect=Fx.none;
customLaser.hitSize=14;
customLaser.drawSize=420;
customLaser.lifetime=16;
customLaser.pierce=true;
customLaser.damage=240;
customLaser.speed=0.001;
const breakthrough=extendContent(LaserTurret,"breakthrough",{
  update(tile){
    const entity=tile.ent();
    this.super$update(tile);
    if(entity.target==null&&!this.shouldActiveSound(tile)){
      if(entity.reload<40){
        var liquid=entity.liquids.current();
        var maxUsed=this.consumes.get(ConsumeType.liquid).amount;
        var used=this.baseReloadSpeed(tile)*(tile.isEnemyCheat()?maxUsed:Math.min(entity.liquids.get(liquid),maxUsed*Time.delta()))*liquid.heatCapacity*this.coolantMultiplier;
        entity.reload+=used;
        entity.liquids.remove(liquid,used);
        if(Mathf.chance(0.06*used)){
          Effects.effect(this.coolEffect,tile.drawx()+Mathf.range(this.size*Vars.tilesize/2),tile.drawy()+Mathf.range(this.size*Vars.tilesize/2));
        }
      }
    }
  },
  load(){
    this.super$load();
    this.baseRegion=Core.atlas.find(this.name+"-base");
  },
  generateIcons: function(){
    return [
      Core.atlas.find(this.name+"-base"),
      Core.atlas.find(this.name)
    ];
  }
});



breakthrough.shootType=customLaser
breakthrough.shootEffect=Fx.shootBigSmoke2;
breakthrough.shootCone=40;
breakthrough.recoil=2;
breakthrough.size=6;
breakthrough.shootShake=2;
breakthrough.range=240;
breakthrough.reload=80;
breakthrough.firingMoveFract=0.4;
breakthrough.shootDuration=240;
breakthrough.powerUse=20;
breakthrough.shootSound=Sounds.laserbig;
breakthrough.activeSound=Sounds.beam;
breakthrough.activeSoundVolume=2;
breakthrough.health=5400;
breakthrough.consumes.add(new ConsumeLiquidFilter(boolf(liquid=>liquid.temperature<=0.5&&liquid.flammability<0.1),0.5)).update(false);
