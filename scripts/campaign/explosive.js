const presstick=140; const timerid=0;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;
const explosive = extendContent(Block, "explosive", {
  placed(tile){
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile){
    this.super$draw(tile);
    if(tile.ent().fuse() && tile.ent().timer.getTime(timerid)%45<22.5) Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  tapped(tile, player){
    if(!tile.ent() || tile.ent().fuse()) return;
    tile.ent().timer.reset(timerid, 0);
    tile.ent().lit();
    //try{
    newSounds.tntfuse.at(tile.worldx(),tile.worldy());
    //}catch(err){print(err);}
  },
  update(tile){
    if(!tile.ent()) return;
    if(tile.ent().fuse()) this.updateFuse(tile);
    else if(tile.ent().cons.valid() || tile.floor().attributes.get(Attribute.heat)>0.01){
      newSounds.tntfuse.at(tile.worldx(),tile.worldy());
      tile.ent().timer.reset(timerid, 0);
      tile.ent().lit();
    }
  },
  updateFuse(tile){
    if(Mathf.chance(0.08)) Effects.effect(customfx.smokeRise, tile.drawx(), tile.drawy());
    var left = presstick - tile.ent().timer.getTime(timerid);
    if(left<=0){
      //this.onDestroyed(tile);
      tile.ent().kill();
      return;
    }
  },
  mineTile(tile, other, dist){
    var drops = other.drop();
    if(this.tier < drops.hardness) return;
    var amount = 1.5+(this.tier-drops.hardness)*0.6;
    amount *= (5-dist)/5;
    amount *= Mathf.random()+0.5;
    var acceptTile = Units.findAllyTile(tile.getTeam(), tile.worldx(), tile.worldy(), 80, boolf(e=>(e.ent() != Conveyor.ConveyorEntity && e.block().acceptItem(drops, e, tile))));
    if(acceptTile == null) return;
    //um
    Call.transferItemTo(drops, amount, other.worldx(), other.worldy(), acceptTile.getTile());
  },
  onDestroyed(tile){
    this.super$onDestroyed(tile);
    if(!Vars.net.client()){
      for(var i=-2;i<=2;i++){
        for(var j=-2;j<=2;j++){
          var other = Vars.world.tile(tile.x+i, tile.y+j);
          if(other!=null && other.drop()!=null) this.mineTile(tile, other, Math.abs(i)+Math.abs(j));
        }
      }
    }
    if(Vars.state.rules.reactorExplosions){
      Damage.damage(tile.worldx(), tile.worldy(), 4*Vars.tilesize, 600);
    }
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.tier = 8;
  }
});

explosive.entityType=prov(() => extend(TileEntity, {
  _trig:false,
  fuse(){
    return this._trig;
  },
  lit(){
    this._trig = true;
  },
  write(stream){
    this.super$write(stream);
    stream.writeBoolean(this._trig);
  },
  read(stream,revision){
    this.super$read(stream,revision);
    this._trig=stream.readBoolean();
  }
}));
