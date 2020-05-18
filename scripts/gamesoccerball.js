var kickpower=10; var dribpower=0.6;

const mechpower={
  "alpha-mech":{
    drib:0.4,
    kick:13
  },
  "delta-mech":{
    drib:1,
    kick:-7
  },
  "tau-mech":{
    drib:0.9,
    kick:0
  },
  "omega-mech":{
    drib:0.8,
    kick:3
  },
  "trident-ship":{
    drib:0.5,
    kick:4
  },
  "glaive-ship":{
    drib:0.3,
    kick:2
  },
  "javelin-ship":{
    drib:0,
    kick:16
  },
  "dart-ship":{
    drib:0.6,
    kick:10
  }
}

const spritename="commandblocks-gamesoccerball";
const white=Color.valueOf("ffffff");
const gamesoccerball = extendContent(UnitType, "gamesoccerball", {
  load(){
    //this.super$load();
    this.region=Core.atlas.find(this.name);
    //this.baseRegion=Core.atlas.find(this.name+"-base");
    //this.shadowRegion=Core.atlas.find(this.name+"-shadow");
    //this.topRegion=Core.atlas.find(this.name+"-top");
    //this.legRegion = Core.atlas.find(this.name+"-top");
  }
});
gamesoccerball.weapon=UnitTypes.draug.weapon;
gamesoccerball.create(prov(() => new JavaAdapter(FlyingUnit, {
  behavior(){
    //just..stands
  },
  updateTargeting(){
    if(this.target!=null) this.target=null;
  },
  update(){
    //this.super$update();
    //BaseUnit
    if(this.isDead()){
    //dead enemies should get immediately removed
      this.remove();
      return;
    }
    this.hitTime -= Time.delta();
    if(Vars.net.client()){
      this.interpolate();
      this.status.update(this);
      return;
    }
    if(!this.isFlying() && (Vars.world.tileWorld(this.x, this.y) != null && !(Vars.world.tileWorld(this.x,this.y).block() instanceof BuildBlock) && Vars.world.tileWorld(this.x, this.y).solid())){
      //when it is stuck in a WALL
      //this.kill();
    }
    this.avoidOthers();
    if(this.spawner != this.noSpawner && (Vars.world.tile(this.spawner) == null || !(Vars.world.tile(this.spawner).entity instanceof UnitFactoryEntity))){
      //when its factory is in a COFFIN
      this.kill();
    }
    this.updateTargeting();
    //this.state.update(); //braindead
    this.updateVelocityStatus();
    //if(this.target != null) this.behavior();
    if(!this.isFlying()){
      this.clampPosition();
    }

    //FlyingUnit
    if(!Vars.net.client()){
      this.updateRotation();
    }
  },
  countsAsEnemy(){
    return false;
  },
  drawStats(){
    this.drawBackItems(this.item.amount > 0 ? 1 : 0, false);
    this.drawLight();
  },
  /*
  drawUnder(){
    //Draw.rect(getIconRegion(), x + offsetX, y + offsetY, rotation - 90);
    Draw.color(white);
    Draw.rect(this.type.baseRegion, this.x, this.y, this.rotation - 90);
    Draw.color();
    //Draw.rect(Core.atlas.find(spritename+"-shadow"), this.x, this.y-4);
  },
  */
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    //Draw.rect(this.type.baseRegion, this.x, this.y, this.rotation - 90);
    Draw.rect(this.type.region, this.x, this.y,this.rotation-90);
    Draw.mixcol();
  //  Draw.color();
  },
  damage(amount){
    this.super$damage(0);
    this.hitTime =this.hitDuration;
  },
  onHit(entity){
    this.super$onHit(entity);
    if(entity instanceof Bullet){
      //kick
      var owner=entity.getOwner();
      var dist=Vec2(this.x,this.y).dst2(owner.x,owner.y);
      var power=kickpower;
      if(owner instanceof Player) power=(mechpower.hasOwnProperty(owner.mech.name))?mechpower[owner.mech.name].kick:kickpower;
      if(dist<45000){
        this.velocity().add(power/(this.x-owner.x)*Time.delta(),power/(this.y-owner.y)*Time.delta());
      }
    }
  },
  //just use mass
  avoidOthers(){
    this.super$avoidOthers();
    var radScl = 1.5;
    var fsize = this.getSize() / radScl;
    var cx = this.x - fsize/2; var cy = this.y - fsize/2;
    Vars.playerGroup.intersect(cx,cy,fsize,fsize).each(cons(ent => {
      if ((ent instanceof Player)&&ent.getTeam()!=this.getTeam()) {
        this.velocity().add(0.02*(this.x-ent.x)*Time.delta(),0.02*(this.y-ent.y)*Time.delta());
        this.velocity().add(
          ((mechpower.hasOwnProperty(ent.mech.name))?mechpower[ent.mech.name].drib:dribpower)*(ent.velocity().x)*Time.delta() ,
          ((mechpower.hasOwnProperty(ent.mech.name))?mechpower[ent.mech.name].drib:dribpower)*(ent.velocity().y)*Time.delta()
        );
      }
    }));
  }
  /*
  avoidOthers(){
    var radScl = 1.5;
    var fsize = this.getSize() / radScl;
    this.moveVector.setZero();
    var cx = this.x - fsize/2; var cy = this.y - fsize/2;
    this.avoid(Vars.unitGroup.intersect(cx, cy, fsize, fsize));

    this.avoid(Vars.playerGroup.intersect(cx, cy, fsize, fsize));

    this.velocity.add(this.moveVector.x / this.mass * Time.delta(), this.moveVector.y / this.mass * Time.delta());
  }
  */
})));
this.global.gamesoccerball=gamesoccerball;
