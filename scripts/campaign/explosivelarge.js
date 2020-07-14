const presstick=200; const timerid=0;
const customfx = this.global.fx;
const newSounds = this.global.newSounds;
const explosivelarge = extendContent(Block, "explosivelarge", {
  placed(tile){
    this.super$placed(tile);
    tile.ent().timer.reset(timerid,presstick+1);
  },
  draw(tile){
    this.super$draw(tile);
    if(tile.ent().fuse() && tile.ent().timer.getTime(timerid)%45<22.5) Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
  },
  /*
  tapped(tile, player){
    if(!tile.ent() || tile.ent().fuse()) return;
    tile.ent().timer.reset(timerid, 0);
    tile.ent().lit();
    //try{
    newSounds.tntfuse.at(tile.worldx(),tile.worldy());
    //}catch(err){print(err);}
  },
  */
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
    if(Mathf.chance(0.15)) Effects.effect(customfx.smokeRise, tile.drawx()+Mathf.random()*10-5, tile.drawy()+Mathf.random()*10-5);
    if(Mathf.chance(0.12)) Effects.effect(Fx.burning, tile.drawx()+Mathf.random()*6-3, tile.drawy()+Mathf.random()*6-3);
    var left = presstick - tile.ent().timer.getTime(timerid);
    if(left<=0){
      //this.onDestroyed(tile);
      tile.ent().kill();
      return;
    }
  },
  mineTile(tile, other, dist){
    var drops = other.drop();
    if(this.tier < drops.hardness || this.minTier > drops.hardness) return;
    var amount = 0.5+(this.tier-drops.hardness)*0.9;
    amount *= (11-dist)/11;
    amount *= 2.8*Mathf.random()+1.6;
    if(amount <= 0) return;
    var acceptTile = Units.findAllyTile(tile.getTeam(), tile.worldx(), tile.worldy(), 120, boolf(e=>(!(e.block() instanceof Conveyor) && e.block().acceptItem(drops, e, tile))));
    if(acceptTile == null) return;
    //um
    Call.transferItemTo(drops, amount, other.worldx(), other.worldy(), acceptTile.getTile());
  },
  onDestroyed(tile){
    this.super$onDestroyed(tile);
    Sounds.explosionbig.at(tile.worldx(),tile.worldy());
    if(!Vars.net.client()){
      for(var i=-4;i<=5;i++){
        for(var j=-4;j<=5;j++){
          var other = Vars.world.tile(tile.x+i, tile.y+j);
          if(other!=null && other.drop()!=null) this.mineTile(tile, other, Math.abs(i)+Math.abs(j));
        }
      }
    }
    if(Vars.state.rules.reactorExplosions){
      Damage.damage(tile.worldx(), tile.worldy(), 7*Vars.tilesize, 1000);
    }
  },
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find(this.name + "-top");
    this.tier = 11;
    this.minTier = 3;//this doesnt make it to setStats
  },
  setStats(){
    this.super$setStats();

    //const tier = this.tier;
    //const minTier = this.minTier;
    const statTable = new StatValue({
      display(table){
        var list = Vars.content.blocks().select(boolf(b => b.isFloor() && b.asFloor().itemDrop != null && b.asFloor().itemDrop.hardness <= 11 && b.asFloor().itemDrop.hardness >= 3)).toArray();

        table.table(cons(l => {
          l.left();
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            l.addImage(item.icon(Cicon.small)).size(8 * 3).padRight(2).padLeft(2).padTop(3).padBottom(3);
            l.add(item.localizedName).left().padLeft(1).padRight(4);
            if(i % 5 == 4){
                l.row();
            }
          }
        }));
      }
    });

    this.stats.add(BlockStat.drillTier, statTable);
  },
  drawSelect(tile){
    if(Vars.player.getTeam() == tile.getTeam()) return;
    Drawf.dashCircle(tile.drawx(), tile.drawy(), 7*Vars.tilesize, tile.getTeam().color);
  },
  drawPlace(x, y, rotation, valid){
    Drawf.dashCircle(x * Vars.tilesize + this.offset(), y * Vars.tilesize + this.offset(), 7*Vars.tilesize, Pal.placing);
  }
});

explosivelarge.entityType=prov(() => extend(TileEntity, {
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
